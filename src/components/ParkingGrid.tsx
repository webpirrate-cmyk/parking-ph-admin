'use client';

import { useState, useMemo, useEffect } from 'react';
import { ReleaseModal } from './ReleaseModal';
import visitorSpotsData from '@/mocks/visitor-spots.json';
import { VisitorService } from '@/services/VisitorService';

interface ParkingSpot {
  id: number;
  name: string;
  status: 0 | 1; // 0 = libre, 1 = ocupado
  placa?: string;
  tipo?: 'CARRO' | 'MOTO';
  entrada?: string;
  destino?: string;
  timestamp?: number;
}

interface ParkingGridProps {
  onSpotSelect?: (spotId: number | null) => void;
}

export function ParkingGrid({ onSpotSelect }: ParkingGridProps) {
  const [currentFilter, setCurrentFilter] = useState<'ALL' | 'FREE' | 'OCCUPIED'>('ALL');
  const [selectedSpotId, setSelectedSpotId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOccupiedSpot, setSelectedOccupiedSpot] = useState<ParkingSpot | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Combinar datos de spots con registros activos desde VisitorService
  const visitorSpots = useMemo(() => {
    // Obtener registros activos desde localStorage
    const activeRegistrations = VisitorService.getActiveRegistrations();

    return visitorSpotsData.visitorSpots.map((spot) => {
      const registration = activeRegistrations.find((reg) => reg.spotId === spot.id);

      if (registration) {
        // Spot ocupado
        const entryDate = new Date(registration.fechaEntrada);
        const formattedTime = entryDate.toLocaleTimeString('es-CO', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        return {
          id: spot.id,
          name: spot.name,
          status: 1 as const,
          placa: registration.placa,
          tipo: registration.tipoVehiculo as 'CARRO' | 'MOTO',
          entrada: formattedTime,
          destino: `Torre ${registration.torre} - Apto ${registration.apto}`,
          timestamp: new Date(registration.fechaEntrada).getTime(),
        };
      } else {
        // Spot libre
        return {
          id: spot.id,
          name: spot.name,
          status: 0 as const,
        };
      }
    });
  }, [refreshKey]); // Dependencia de refreshKey para forzar actualización

  const freeCount = visitorSpots.filter((s) => s.status === 0).length;
  const occCount = visitorSpots.filter((s) => s.status === 1).length;

  // Filtrar datos según filtro activo
  let filteredSpots = visitorSpots;
  if (currentFilter === 'FREE') filteredSpots = visitorSpots.filter((s) => s.status === 0);
  if (currentFilter === 'OCCUPIED') filteredSpots = visitorSpots.filter((s) => s.status === 1);

  const toggleFilter = (filter: 'FREE' | 'OCCUPIED') => {
    setCurrentFilter((current) => (current === filter ? 'ALL' : filter));
  };

  const selectSpot = (id: number) => {
    const newSelectedId = selectedSpotId === id ? null : id;
    setSelectedSpotId(newSelectedId);
    onSpotSelect?.(newSelectedId);
  };

  const openReleaseModal = (spot: ParkingSpot) => {
    setSelectedOccupiedSpot(spot);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOccupiedSpot(null);
  };

  const confirmRelease = () => {
    if (selectedOccupiedSpot) {
      const success = VisitorService.registerExit(selectedOccupiedSpot.id);
      
      if (success) {
        closeModal();
        setRefreshKey(prev => prev + 1); // Forzar actualización del grid
        alert('✅ Salida registrada exitosamente!');
      } else {
        alert('❌ Error al registrar salida');
      }
    }
  };

  return (
    <>
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex justify-between items-center">
        <span>2. Seleccionar Parqueadero</span>
        {currentFilter !== 'ALL' && (
          <span
            className={`text-[9px] px-2 py-0.5 rounded font-bold ${
              currentFilter === 'FREE'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-rose-100 text-rose-700'
            }`}
          >
            {currentFilter === 'FREE' ? 'FILTRO: DISPONIBLES' : 'FILTRO: OCUPADOS'}
          </span>
        )}
      </h3>

      {/* FILTROS */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left text-[10px] font-bold text-gray-400 uppercase px-4 py-2">
                Toca para filtrar
              </th>
              <th className="text-right text-[10px] font-bold text-gray-400 uppercase px-4 py-2">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* Disponibles */}
            <tr
              onClick={() => toggleFilter('FREE')}
              className={`cursor-pointer transition-all border-l-4 ${
                currentFilter === 'FREE'
                  ? 'bg-emerald-50/50 border-emerald-500'
                  : 'hover:bg-gray-50 border-transparent'
              }`}
            >
              <td className="px-4 py-3 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200"></div>
                <span className="text-sm font-bold text-gray-700">Disponibles</span>
                {currentFilter === 'FREE' && (
                  <i className="fa-solid fa-filter text-emerald-500 text-xs"></i>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <span className="text-lg font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                  {freeCount}
                </span>
              </td>
            </tr>

            {/* Ocupados */}
            <tr
              onClick={() => toggleFilter('OCCUPIED')}
              className={`cursor-pointer transition-all border-l-4 ${
                currentFilter === 'OCCUPIED'
                  ? 'bg-rose-50/50 border-rose-500'
                  : 'hover:bg-gray-50 border-transparent'
              }`}
            >
              <td className="px-4 py-3 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-200"></div>
                <span className="text-sm font-bold text-gray-700">Ocupados</span>
                {currentFilter === 'OCCUPIED' && (
                  <i className="fa-solid fa-filter text-rose-500 text-xs"></i>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <span className="text-lg font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-lg">
                  {occCount}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* GRID CON ALTURA FIJA Y SCROLL */}
      <div className="h-[260px] overflow-y-auto pr-1 custom-scrollbar bg-slate-50/50 rounded-lg border border-slate-100 p-2">
        {filteredSpots.length > 0 ? (
          <div className="grid grid-cols-4 gap-3 transition-all pb-2">
            {filteredSpots.map(spot => (
              <div
                key={spot.id}
                onClick={() => (spot.status === 0 ? selectSpot(spot.id) : openReleaseModal(spot))}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center relative touch-manipulation shadow-sm ${
                  spot.status === 1
                    ? 'bg-rose-50 border-2 border-rose-200 cursor-pointer'
                    : selectedSpotId === spot.id
                    ? 'bg-emerald-500 border-2 border-emerald-600 scale-95 cursor-pointer'
                    : 'bg-emerald-50 border border-emerald-100 cursor-pointer'
                }`}
              >
                {spot.status === 1 ? (
                  // Ocupado
                  <>
                    <span className="text-[9px] font-bold text-rose-300 absolute top-1 left-1.5">
                      {spot.name}
                    </span>
                    <i
                      className={`fa-solid ${
                        spot.tipo === 'MOTO' ? 'fa-motorcycle' : 'fa-car'
                      } text-rose-500 text-lg`}
                    ></i>
                    <span className="text-[10px] font-black text-rose-800 bg-rose-100 px-1 rounded mt-1">
                      {spot.placa}
                    </span>
                  </>
                ) : selectedSpotId === spot.id ? (
                  // Seleccionado
                  <>
                    <span className="text-[9px] font-bold text-emerald-200 absolute top-1 left-1.5">
                      {spot.name}
                    </span>
                    <i className="fa-solid fa-check text-white text-2xl"></i>
                  </>
                ) : (
                  // Disponible
                  <span className="text-sm font-bold text-emerald-400">{spot.name}</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <i className="fa-solid fa-filter-circle-xmark text-3xl mb-2"></i>
            <p className="text-xs">No hay registros</p>
          </div>
        )}
      </div>
    </div>

    {/* Modal de liberación */}
    <ReleaseModal
      isOpen={isModalOpen}
      onClose={closeModal}
      onConfirm={confirmRelease}
      spotData={
        selectedOccupiedSpot
          ? {
              id: selectedOccupiedSpot.id,
              placa: selectedOccupiedSpot.placa!,
              tipo: selectedOccupiedSpot.tipo!,
              entrada: selectedOccupiedSpot.entrada!,
              destino: selectedOccupiedSpot.destino!,
              timestamp: selectedOccupiedSpot.timestamp!,
            }
          : null
      }
    />
  </>
  );
}

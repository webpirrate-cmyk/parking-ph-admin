import ownersData from '@/mocks/owners.json';
import { VisitorService } from './VisitorService';

interface SearchResult {
  placa: string;
  tipo: 'PROPIETARIO' | 'VISITANTE';
  torre: string;
  piso?: string;
  apto: string;
  parqueadero: string;
  tipoVehiculo: 'CARRO' | 'MOTO';
  fechaEntrada?: string;
}

export class SearchService {
  // Buscar placa en propietarios y visitantes
  static searchPlate(placa: string): SearchResult | null {
    const plateUpper = placa.toUpperCase().trim();

    // 1. Buscar en propietarios
    for (const owner of ownersData.owners) {
      for (const apartment of owner.apartments) {
        for (const parkingSpot of apartment.parkingSpots) {
          for (const vehicle of parkingSpot.vehicles || []) {
            if (vehicle.plate === plateUpper) {
              return {
                placa: vehicle.plate,
                tipo: 'PROPIETARIO',
                torre: apartment.tower,
                piso: apartment.floor,
                apto: apartment.number,
                parqueadero: parkingSpot.code,
                tipoVehiculo: vehicle.type as 'CARRO' | 'MOTO',
              };
            }
          }
        }
      }
    }

    // 2. Buscar en visitantes activos
    const activeRegistrations = VisitorService.getActiveRegistrations();
    const visitorReg = activeRegistrations.find((reg) => reg.placa === plateUpper);

    if (visitorReg) {
      const entryDate = new Date(visitorReg.fechaEntrada);
      const formattedTime = entryDate.toLocaleString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      return {
        placa: visitorReg.placa,
        tipo: 'VISITANTE',
        torre: visitorReg.torre,
        piso: visitorReg.piso,
        apto: visitorReg.apto,
        parqueadero: visitorReg.spotName,
        tipoVehiculo: visitorReg.tipoVehiculo,
        fechaEntrada: formattedTime,
      };
    }

    // No encontrado
    return null;
  }
}

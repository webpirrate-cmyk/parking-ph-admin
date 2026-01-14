'use client';

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

interface SearchResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: SearchResult | null;
  notFound: boolean;
}

export function SearchResultModal({ isOpen, onClose, result, notFound }: SearchResultModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl transform transition-all relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-black text-gray-800">
              {notFound ? 'No Encontrado' : result?.placa}
            </h3>
            {result && (
              <p className="text-sm text-gray-500 font-medium">
                {result.tipo === 'PROPIETARIO' ? 'Vehículo Propietario' : 'Visitante'}
              </p>
            )}
          </div>
          <div
            onClick={onClose}
            className="bg-gray-100 p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <i className="fa-solid fa-xmark text-gray-500"></i>
          </div>
        </div>

        {/* Contenido */}
        {notFound ? (
          <div className="text-center py-8">
            <i className="fa-solid fa-search text-gray-300 text-5xl mb-4"></i>
            <p className="text-gray-600 font-medium mb-2">Placa no encontrada</p>
            <p className="text-sm text-gray-400">
              No hay registros para esta placa en el sistema
            </p>
          </div>
        ) : result ? (
          <div className="space-y-4">
            {/* Información del vehículo */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">Torre</p>
                  <p className="text-lg font-black text-slate-700">{result.torre}</p>
                </div>
                {result.piso && (
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Piso</p>
                    <p className="text-lg font-black text-slate-700">{result.piso}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">Apartamento</p>
                  <p className="text-lg font-black text-slate-700">{result.apto}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">Parqueadero</p>
                  <p className="text-lg font-black text-emerald-600">{result.parqueadero}</p>
                </div>
              </div>
            </div>

            {/* Tipo de vehículo */}
            <div className="flex items-center justify-center gap-3 p-3 bg-blue-50 rounded-xl">
              <i
                className={`fa-solid ${
                  result.tipoVehiculo === 'CARRO' ? 'fa-car' : 'fa-motorcycle'
                } text-blue-600 text-2xl`}
              ></i>
              <span className="font-bold text-blue-700">{result.tipoVehiculo}</span>
            </div>

            {/* Fecha de entrada si es visitante */}
            {result.tipo === 'VISITANTE' && result.fechaEntrada && (
              <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-xs text-amber-600 font-bold uppercase mb-1">Entrada</p>
                <p className="text-sm font-bold text-amber-700">{result.fechaEntrada}</p>
              </div>
            )}

            {/* Badge de tipo */}
            <div className="text-center">
              <span
                className={`inline-block px-4 py-2 rounded-full text-xs font-bold ${
                  result.tipo === 'PROPIETARIO'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {result.tipo === 'PROPIETARIO' ? '🏠 PROPIETARIO' : '👤 VISITANTE'}
              </span>
            </div>
          </div>
        ) : null}

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 active:scale-95 transition-all text-sm"
        >
          CERRAR
        </button>
      </div>
    </div>
  );
}

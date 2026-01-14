'use client';

interface ReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  spotData: {
    id: number;
    placa: string;
    tipo: 'CARRO' | 'MOTO';
    entrada: string;
    destino: string;
    timestamp: number;
  } | null;
}

const PRICE_PER_HOUR = 2000;

export function ReleaseModal({ isOpen, onClose, onConfirm, spotData }: ReleaseModalProps) {
  if (!spotData) return null;

  // Calcular tiempo y costo
  const now = new Date().getTime();
  const diffMins = Math.floor((now - spotData.timestamp) / 60000);
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;

  let cost = 0;
  let statusText = '¡GRATIS! (<2h)';

  if (diffMins > 120) {
    const extra = Math.ceil((diffMins - 120) / 60);
    cost = extra * PRICE_PER_HOUR;
    statusText = `Cobro: ${extra}h extra`;
  }

  return (
    <div
      className={`fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl transform transition-all relative overflow-hidden ${
          isOpen ? 'scale-100' : 'scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-black text-gray-800">{spotData.placa}</h3>
            <p className="text-sm text-gray-500 font-medium">Puesto V-{spotData.id}</p>
          </div>
          <div
            onClick={onClose}
            className="bg-gray-100 p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <i className="fa-solid fa-xmark text-gray-500"></i>
          </div>
        </div>

        {/* Detalles */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Hora Entrada:</span>
            <span className="font-bold">{spotData.entrada}</span>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Destino:</span>
            <span className="font-bold">{spotData.destino}</span>
          </div>

          {/* Costo */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-500 font-bold uppercase">Tiempo Total</span>
              <span className="text-sm font-bold text-slate-700">
                {hours}h {mins}m
              </span>
            </div>

            <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200">
              <span className="text-sm font-bold text-slate-700">Total a Pagar</span>
              <div className="text-right">
                <span
                  className={`block text-3xl font-black leading-none ${
                    cost > 0 ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  ${cost}
                </span>
                <span
                  className={`text-[10px] font-bold ${
                    cost > 0 ? 'text-rose-500' : 'text-emerald-500'
                  }`}
                >
                  {statusText}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Botón */}
        <button
          onClick={onConfirm}
          className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 touch-manipulation"
        >
          <i className="fa-solid fa-arrow-right-from-bracket"></i> REGISTRAR SALIDA
        </button>
      </div>
    </div>
  );
}

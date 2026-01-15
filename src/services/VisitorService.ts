import visitorRegistrationsData from '@/mocks/visitor-registrations.json';

interface VisitorRegistration {
  id: number;
  spotId: number;
  spotName: string;
  torre: string;
  piso: string;
  apto: string;
  tipoVehiculo: 'CARRO' | 'MOTO';
  placa: string;
  fechaEntrada: string;
  fechaRetiro: string | null;
}

// En un entorno real, esto haría una llamada a una API
// Por ahora, trabajamos con localStorage para simular persistencia
const STORAGE_KEY = 'visitor_registrations';

export class VisitorService {
  // Obtener todos los registros
  static getRegistrations(): VisitorRegistration[] {
    if (typeof window === 'undefined') {
      return visitorRegistrationsData.registrations as VisitorRegistration[];
    }
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Inicializar con datos del JSON
    const initialData = visitorRegistrationsData.registrations as VisitorRegistration[];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }

  // Obtener registros activos (sin fecha de retiro)
  static getActiveRegistrations(): VisitorRegistration[] {
    return this.getRegistrations().filter((reg) => reg.fechaRetiro === null);
  }

  // Registrar nueva entrada
  static registerEntry(data: {
    spotId: number;
    spotName: string;
    torre: string;
    piso: string;
    apto: string;
    tipoVehiculo: 'CARRO' | 'MOTO';
    placa: string;
  }): VisitorRegistration {
    const registrations = this.getRegistrations();
    
    // Generar nuevo ID
    const newId = registrations.length > 0 
      ? Math.max(...registrations.map(r => r.id)) + 1 
      : 1;

    const newRegistration: VisitorRegistration = {
      id: newId,
      spotId: data.spotId,
      spotName: data.spotName,
      torre: data.torre,
      piso: data.piso,
      apto: data.apto,
      tipoVehiculo: data.tipoVehiculo,
      placa: data.placa,
      fechaEntrada: new Date().toISOString(),
      fechaRetiro: null,
    };

    registrations.push(newRegistration);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));

    return newRegistration;
  }

  // Registrar salida
  static registerExit(spotId: number): boolean {
    const registrations = this.getRegistrations();
    const registration = registrations.find(
      (reg) => reg.spotId === spotId && reg.fechaRetiro === null
    );

    if (!registration) return false;

    registration.fechaRetiro = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));

    return true;
  }

  // Verificar si un spot está ocupado
  static isSpotOccupied(spotId: number): boolean {
    return this.getActiveRegistrations().some((reg) => reg.spotId === spotId);
  }
}

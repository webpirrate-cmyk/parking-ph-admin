"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/layout";

export default function Home() {
  const { data: session, status } = useSession();
  
  // ✅ TODOS LOS HOOKS AL PRINCIPIO
  const [currentView, setCurrentView] = useState<"search" | "visitors">("search");
  const [searchVehicleType, setSearchVehicleType] = useState<"CARRO" | "MOTO">("CARRO");
  const [visitVehicleType, setVisitVehicleType] = useState<"CARRO" | "MOTO">("MOTO");
  const [searchPlateValue, setSearchPlateValue] = useState("");
  const [visitPlateValue, setVisitPlateValue] = useState("");
  const [searchPlateValid, setSearchPlateValid] = useState<boolean | null>(null);
  const [visitPlateValid, setVisitPlateValid] = useState<boolean | null>(null);

  // Validación de placas
  const handlePlateInput = useCallback(
    (
      value: string,
      type: "CARRO" | "MOTO",
      setter: (val: string) => void,
      validSetter: (val: boolean | null) => void
    ) => {
      // 1. Obtener caracteres alfanuméricos solamente
      let raw = value.toUpperCase().replace(/[^A-Z0-9]/g, "");

      // 2. Limitar longitud máxima (6 caracteres)
      if (raw.length > 6) raw = raw.slice(0, 6);

      // 3. Construir valor con guion
      let formattedValue = "";
      if (raw.length > 3) {
        formattedValue = raw.slice(0, 3) + "-" + raw.slice(3);
      } else {
        formattedValue = raw;
      }

      // 4. Asignar valor formateado
      setter(formattedValue);

      // 5. Validar según tipo de vehículo
      let isValid: boolean | null = null;

      if (formattedValue.length > 0) {
        if (type === "CARRO") {
          // 3 Letras, Guion, 3 Números
          const carRegex = /^[A-Z]{3}-[0-9]{3}$/;
          isValid = carRegex.test(formattedValue);
        } else {
          // 3 Letras, Guion, 2 Números, 1 Letra
          const motoRegex = /^[A-Z]{3}-[0-9]{2}[A-Z]$/;
          isValid = motoRegex.test(formattedValue);
        }
      }

      validSetter(isValid);
    },
    []
  );

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status]);

  // ✅ CONDITIONAL RETURNS DESPUÉS DE TODOS LOS HOOKS
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  // ✅ FUNCIONES HELPER DESPUÉS DE RETURNS (NO SON HOOKS)
  // Formato dinámico según tipo de vehículo
  const getPlateFormat = (type: "CARRO" | "MOTO") => {
    return type === "CARRO"
      ? { placeholder: "ABC-123", hint: "Formato: ABC-123 (3 letras - 3 números)" }
      : { placeholder: "ABC-12D", hint: "Formato: ABC-12D (3 letras - 2 números - 1 letra)" };
  };

  // Función para obtener clases de validación
  const getValidationClasses = (isValid: boolean | null, baseClasses: string) => {
    if (isValid === null) {
      return `${baseClasses} border-gray-200 focus:border-blue-500`;
    } else if (isValid) {
      return `${baseClasses} border-green-500 text-green-600`;
    } else {
      return `${baseClasses} border-red-500 text-red-600`;
    }
  };

  return (
    <AdminLayout
      title="Control PH"
      subtitle="Torres del Parque"
      initialTab={currentView}
      onTabChange={setCurrentView}
    >
      {currentView === "search" ? (
        <section className="max-w-md mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 border border-gray-100">
            <label className="block text-sm font-semibold text-gray-600 mb-3 text-center">
              Consultar Autorización
            </label>

            {/* Selector tipo vehículo */}
            <div className="flex gap-3 mb-4">
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="searchType"
                  value="CARRO"
                  className="peer sr-only"
                  checked={searchVehicleType === "CARRO"}
                  onChange={() => setSearchVehicleType("CARRO")}
                />
                <div className="text-center py-2 px-2 rounded-xl border-2 border-gray-100 bg-white text-gray-400 peer-checked:bg-blue-50 peer-checked:text-blue-600 peer-checked:border-blue-500 transition-all font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50">
                  <i className="fa-solid fa-car text-sm"></i> CARRO
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="searchType"
                  value="MOTO"
                  className="peer sr-only"
                  checked={searchVehicleType === "MOTO"}
                  onChange={() => setSearchVehicleType("MOTO")}
                />
                <div className="text-center py-2 px-2 rounded-xl border-2 border-gray-100 bg-white text-gray-400 peer-checked:bg-blue-50 peer-checked:text-blue-600 peer-checked:border-blue-500 transition-all font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50">
                  <i className="fa-solid fa-motorcycle text-sm"></i> MOTO
                </div>
              </label>
            </div>

            {/* Input de búsqueda */}
            <div className="relative">
              <input
                type="text"
                id="searchInput"
                value={searchPlateValue}
                onChange={(e) =>
                  handlePlateInput(
                    e.target.value,
                    searchVehicleType,
                    setSearchPlateValue,
                    setSearchPlateValid
                  )
                }
                placeholder={getPlateFormat(searchVehicleType).placeholder}
                className={getValidationClasses(
                  searchPlateValid,
                  "w-full text-center text-2xl font-black uppercase p-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder-gray-400 tracking-wider text-gray-800"
                )}
              />
              <button className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-4 rounded-lg active:scale-95 transition-transform shadow-md hover:bg-blue-700">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
            <p className="text-xs text-center text-gray-400 mt-2">
              {getPlateFormat(searchVehicleType).hint}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <i className="fa-solid fa-info-circle text-blue-600 text-2xl mb-2"></i>
            <p className="text-sm text-blue-800 font-medium">Vista de Consulta</p>
            <p className="text-xs text-blue-600 mt-1">
              Aquí irá el formulario completo de búsqueda
            </p>
          </div>
        </section>
      ) : (
        <section className="max-w-md mx-auto space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
              <h2 className="text-sm font-bold text-gray-700">1. Datos del Visitante</h2>
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
                14 Libres
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Torre */}
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">TORRE</label>
                <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-lg text-gray-800">
                  <option value="">---</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </select>
              </div>

              {/* Piso */}
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">PISO</label>
                <input
                  type="number"
                  placeholder="Ej: 2"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-lg placeholder-gray-400 text-gray-800"
                />
              </div>

              {/* Apto */}
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">APTO</label>
                <input
                  type="number"
                  placeholder="204"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-lg placeholder-gray-400 text-gray-800"
                />
              </div>

              {/* Tipo Vehículo */}
              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-500 mb-2 block">
                  TIPO DE VEHÍCULO
                </label>
                <div className="flex gap-3">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="visitType"
                      value="CARRO"
                      className="peer sr-only"
                      checked={visitVehicleType === "CARRO"}
                      onChange={() => setVisitVehicleType("CARRO")}
                    />
                    <div className="text-center py-3 px-2 rounded-xl border-2 border-gray-100 bg-white text-gray-400 peer-checked:bg-blue-50 peer-checked:text-blue-600 peer-checked:border-blue-500 transition-all font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50">
                      <i className="fa-solid fa-car text-lg"></i> CARRO
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="visitType"
                      value="MOTO"
                      className="peer sr-only"
                      checked={visitVehicleType === "MOTO"}
                      onChange={() => setVisitVehicleType("MOTO")}
                    />
                    <div className="text-center py-3 px-2 rounded-xl border-2 border-gray-100 bg-white text-gray-400 peer-checked:bg-blue-50 peer-checked:text-blue-600 peer-checked:border-blue-500 transition-all font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50">
                      <i className="fa-solid fa-motorcycle text-lg"></i> MOTO
                    </div>
                  </label>
                </div>
              </div>

              {/* Placa */}
              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-500 mb-1 block">PLACA VEHÍCULO</label>
                <input
                  type="text"
                  value={visitPlateValue}
                  onChange={(e) =>
                    handlePlateInput(
                      e.target.value,
                      visitVehicleType,
                      setVisitPlateValue,
                      setVisitPlateValid
                    )
                  }
                  placeholder={getPlateFormat(visitVehicleType).placeholder}
                  className={getValidationClasses(
                    visitPlateValid,
                    "w-full p-3 bg-gray-50 border-2 rounded-xl font-bold uppercase text-center focus:outline-none text-2xl tracking-widest transition-colors placeholder-gray-400 text-gray-800"
                  )}
                />
                <p className="text-[10px] text-gray-400 text-center mt-1">
                  {getPlateFormat(visitVehicleType).hint}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
            <i className="fa-solid fa-car-side text-emerald-600 text-2xl mb-2"></i>
            <p className="text-sm text-emerald-800 font-medium">Vista de Visitantes</p>
            <p className="text-xs text-emerald-600 mt-1">
              Aquí irá el formulario completo y grid de parqueaderos
            </p>
          </div>
        </section>
      )}
    </AdminLayout>
  );
}

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>Control Acceso PH</title>
    
    <meta name="theme-color" content="#1e293b">
    <link rel="manifest" href="manifest.json">
    <link rel="apple-touch-icon" href="icons/icon-192.png">

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Iconos -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        /* Estilos Base */
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden; 
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #f3f4f6;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
        }
        
        .fade-in {
            animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        /* Scrollbar personalizada para la lista de parqueaderos */
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1; 
            border-radius: 4px;
        }

        .nav-item.active { color: #2563eb; }
        .nav-item.active .indicator { background-color: #2563eb; }
        
        @keyframes pulse-yellow {
            0% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(234, 179, 8, 0); }
            100% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0); }
        }
        .animate-pulse-yellow { animation: pulse-yellow 2s infinite; }
    </style>
</head>
<body class="flex flex-col text-gray-800 bg-gray-100 h-full w-full">

    <!-- HEADER -->
    <header class="bg-slate-800 text-white p-4 shadow-md z-30 flex justify-between items-center shrink-0 h-[60px]">
        <div>
            <h1 class="text-lg font-bold">Control PH</h1>
            <p class="text-[10px] text-slate-400">Torres del Parque</p>
        </div>
        <div class="h-8 w-8 bg-slate-700 rounded-full flex items-center justify-center border border-slate-600">
            <i class="fa-solid fa-user-shield text-xs"></i>
        </div>
    </header>

    <!-- MAIN CONTAINER -->
    <main id="main-container" class="flex-1 overflow-y-auto hide-scroll relative p-4 pb-32 w-full">
        
        <!-- PANTALLA 1: CONSULTA PROPIETARIOS -->
        <section id="screen-search" class="hidden max-w-md mx-auto">
            <div class="bg-white p-6 rounded-2xl shadow-sm mb-6 border border-gray-100">
                <label class="block text-sm font-semibold text-gray-600 mb-3 text-center">Consultar Autorización</label>
                
                <!-- SELECTOR TIPO VEHICULO (NUEVO EN CONSULTA) -->
                <div class="flex gap-3 mb-4">
                    <label class="flex-1 cursor-pointer">
                        <input type="radio" name="searchType" value="CARRO" class="peer sr-only" checked onchange="clearAndFocusSearchPlate()">
                        <div class="text-center py-2 px-2 rounded-xl border-2 border-gray-100 bg-white text-gray-400 peer-checked:bg-blue-50 peer-checked:text-blue-600 peer-checked:border-blue-500 transition-all font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50">
                            <i class="fa-solid fa-car text-sm"></i> CARRO
                        </div>
                    </label>
                    <label class="flex-1 cursor-pointer">
                        <input type="radio" name="searchType" value="MOTO" class="peer sr-only" onchange="clearAndFocusSearchPlate()">
                        <div class="text-center py-2 px-2 rounded-xl border-2 border-gray-100 bg-white text-gray-400 peer-checked:bg-blue-50 peer-checked:text-blue-600 peer-checked:border-blue-500 transition-all font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50">
                            <i class="fa-solid fa-motorcycle text-sm"></i> MOTO
                        </div>
                    </label>
                </div>

                <div class="relative">
                    <input type="text" id="searchInput" placeholder="XXX-000" 
                           class="w-full text-center text-2xl font-black uppercase p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder-gray-300 tracking-wider"
                           autocomplete="off"
                           inputmode="text"
                           onkeyup="if(event.key === 'Enter') buscarPlaca()">
                    <button onclick="buscarPlaca()" class="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-4 rounded-lg active:scale-95 transition-transform shadow-md hover:bg-blue-700">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>
                <p class="text-xs text-center text-gray-400 mt-2" id="searchPlateHint">Formato: ABC-123</p>
                <p class="text-[10px] text-center text-gray-300 mt-1">Prueba: <span class="font-mono bg-gray-50 px-1 rounded border border-gray-100">ABC-123</span> o <span class="font-mono bg-gray-50 px-1 rounded border border-gray-100">MTX-85L</span></p>
            </div>
            <div id="searchResult" class="hidden"></div>
        </section>

        <!-- PANTALLA 2: REGISTRO VISITANTES -->
        <section id="screen-visitors" class="block max-w-md mx-auto space-y-4">
            
            <!-- 1. FORMULARIO DE DATOS -->
            <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div class="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                    <h2 class="text-sm font-bold text-gray-700">1. Datos del Visitante</h2>
                    <span class="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium" id="spotsCount">---</span>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <!-- Fila 1: Torre y Apto -->
                    <div>
                        <label class="text-xs font-bold text-gray-500 mb-1 block">TORRE</label>
                        <div class="relative">
                            <select id="visitTorre" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-lg appearance-none">
                                <option value="" disabled selected>---</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                            </select>
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                <i class="fa-solid fa-chevron-down text-xs"></i>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label class="text-xs font-bold text-gray-500 mb-1 block">APTO DESTINO</label>
                        <input type="number" id="visitApto" placeholder="Ej: 204" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-lg" inputmode="numeric">
                    </div>

                    <!-- Fila 2: TIPO VEHICULO -->
                    <div class="col-span-2">
                        <label class="text-xs font-bold text-gray-500 mb-2 block">TIPO DE VEHÍCULO</label>
                        <div class="flex gap-3">
                            <label class="flex-1 cursor-pointer">
                                <input type="radio" name="visitType" value="CARRO" class="peer sr-only" checked onchange="clearAndFocusPlate()">
                                <div class="text-center py-3 px-2 rounded-xl border-2 border-gray-100 bg-white text-gray-400 peer-checked:bg-blue-50 peer-checked:text-blue-600 peer-checked:border-blue-500 transition-all font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50">
                                    <i class="fa-solid fa-car text-lg"></i> CARRO
                                </div>
                            </label>
                            <label class="flex-1 cursor-pointer">
                                <input type="radio" name="visitType" value="MOTO" class="peer sr-only" onchange="clearAndFocusPlate()">
                                <div class="text-center py-3 px-2 rounded-xl border-2 border-gray-100 bg-white text-gray-400 peer-checked:bg-blue-50 peer-checked:text-blue-600 peer-checked:border-blue-500 transition-all font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50">
                                    <i class="fa-solid fa-motorcycle text-lg"></i> MOTO
                                </div>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Fila 3: Placa (Ancho completo) -->
                    <div class="col-span-2">
                        <label class="text-xs font-bold text-gray-500 mb-1 block">PLACA VEHÍCULO</label>
                        <input type="text" id="visitPlate" placeholder="XXX-000" class="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold uppercase text-center focus:outline-none text-2xl tracking-widest transition-colors">
                        <p class="text-[10px] text-gray-400 text-center mt-1" id="plateHint">Formato: ABC-123</p>
                    </div>
                </div>
            </div>

            <!-- 2. SELECCIÓN DE CUPO (TABLERO) -->
            <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                    <span>2. Seleccionar Parqueadero</span>
                    <span id="filterStatus" class="text-[9px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded hidden">FILTRADO</span>
                </h3>

                <!-- FILTROS -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
                    <table class="w-full">
                        <thead class="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th class="text-left text-[10px] font-bold text-gray-400 uppercase px-4 py-2">Toca para filtrar</th>
                                <th class="text-right text-[10px] font-bold text-gray-400 uppercase px-4 py-2">Total</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                             <tr id="filterFreeRow" onclick="toggleFilter('FREE')" class="cursor-pointer hover:bg-gray-50 transition-all border-l-4 border-transparent">
                                <td class="px-4 py-3 flex items-center gap-2">
                                    <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200"></div>
                                    <span class="text-sm font-bold text-gray-700">Disponibles</span>
                                    <i id="iconFree" class="fa-solid fa-filter text-emerald-500 text-xs opacity-0 transition-opacity"></i>
                                </td>
                                <td class="px-4 py-3 text-right">
                                    <span class="text-lg font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg" id="summaryFree">--</span>
                                </td>
                            </tr>
                            <tr id="filterOccupiedRow" onclick="toggleFilter('OCCUPIED')" class="cursor-pointer hover:bg-gray-50 transition-all border-l-4 border-transparent">
                                <td class="px-4 py-3 flex items-center gap-2">
                                    <div class="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-200"></div>
                                    <span class="text-sm font-bold text-gray-700">Ocupados</span>
                                    <i id="iconOccupied" class="fa-solid fa-filter text-rose-500 text-xs opacity-0 transition-opacity"></i>
                                </td>
                                <td class="px-4 py-3 text-right">
                                    <span class="text-lg font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-lg" id="summaryOccupied">--</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <!-- GRID CON ALTURA FIJA Y SCROLL -->
                <div class="h-[260px] overflow-y-auto pr-1 custom-scrollbar bg-slate-50/50 rounded-lg border border-slate-100 p-2">
                    <div id="parkingGrid" class="grid grid-cols-4 gap-3 transition-all pb-2"></div>
                    <div id="emptyState" class="hidden flex flex-col items-center justify-center py-10 text-gray-400">
                        <i class="fa-solid fa-filter-circle-xmark text-3xl mb-2"></i>
                        <p class="text-xs">No hay registros</p>
                    </div>
                </div>
            </div>

            <!-- 3. ACCIÓN FINAL (BOTÓN) -->
            <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div class="flex justify-between items-center bg-slate-50 p-3 rounded-xl mb-4 border border-slate-100">
                    <span class="text-xs text-slate-500 font-medium">Cupo Seleccionado:</span>
                    <span id="selectedSpotDisplay" class="font-black text-slate-700 text-xl tracking-tight">---</span>
                </div>

                <button onclick="registrarVisita()" id="btnRegister" disabled 
                        class="w-full bg-gray-200 text-gray-400 font-bold py-4 rounded-xl transition-all duration-200 shadow-none text-sm uppercase tracking-wide flex items-center justify-center gap-2 touch-manipulation">
                    <i class="fa-solid fa-check"></i> Registrar Entrada
                </button>
            </div>

        </section>

    </main>

    <!-- TOAST -->
    <div id="toast" class="fixed top-5 left-1/2 transform -translate-x-1/2 bg-gray-800/95 backdrop-blur text-white px-6 py-3 rounded-full shadow-2xl z-[60] transition-all duration-300 opacity-0 pointer-events-none flex items-center gap-3 translate-y-[-20px] w-max max-w-[90%]">
        <i id="toastIcon" class="fa-solid fa-circle-check text-green-400"></i>
        <span id="toastMsg" class="font-medium text-sm truncate">Mensaje</span>
    </div>

    <!-- BOTTOM NAV -->
    <nav class="bg-white border-t border-gray-200 fixed bottom-0 w-full pb-2 pt-1 px-6 flex justify-around shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-40 h-[70px] safe-area-bottom">
        <button onclick="switchTab('search')" id="nav-search" class="nav-item flex flex-col items-center p-2 w-20 text-gray-400 transition-colors group touch-manipulation">
            <div class="mb-1 p-1 rounded-full group-hover:bg-gray-50 transition-colors">
                <i class="fa-solid fa-magnifying-glass text-xl"></i>
            </div>
            <span class="text-[10px] font-semibold tracking-wide">Consultar</span>
            <div class="indicator w-1 h-1 rounded-full mt-1 bg-transparent transition-colors"></div>
        </button>
        
        <div class="relative -top-8 group cursor-pointer touch-manipulation" onclick="switchTab('visitors')">
            <div class="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center shadow-lg shadow-slate-300 border-[6px] border-gray-100 transform transition-transform group-active:scale-95">
               <i class="fa-solid fa-car-side text-white text-2xl"></i>
            </div>
        </div>

        <button onclick="switchTab('visitors')" id="nav-visitors" class="nav-item active flex flex-col items-center p-2 w-20 text-gray-400 transition-colors group touch-manipulation">
            <div class="mb-1 p-1 rounded-full group-hover:bg-gray-50 transition-colors">
                <i class="fa-regular fa-id-card text-xl"></i>
            </div>
            <span class="text-[10px] font-semibold tracking-wide">Visitantes</span>
            <div class="indicator w-1 h-1 rounded-full mt-1 bg-transparent transition-colors"></div>
        </button>
    </nav>

    <!-- MODAL -->
    <div id="visitorModal" class="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[50] hidden flex items-center justify-center p-4 transition-opacity duration-300">
        <div class="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl transform transition-all scale-100 relative overflow-hidden">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-2xl font-black text-gray-800" id="modalPlate">XYZ-123</h3>
                    <p class="text-sm text-gray-500 font-medium" id="modalSpot">Puesto V-01</p>
                </div>
                <div onclick="closeModal()" class="bg-gray-100 p-2 rounded-full cursor-pointer hover:bg-gray-200">
                    <i class="fa-solid fa-xmark text-gray-500"></i>
                </div>
            </div>
            <div class="space-y-3 mb-6">
                <div class="flex justify-between text-sm text-gray-600">
                    <span>Hora Entrada:</span>
                    <span class="font-bold" id="modalTime">10:00 AM</span>
                </div>
                <!-- Mostrar Torre en el modal -->
                <div class="flex justify-between text-sm text-gray-600">
                    <span>Destino:</span>
                    <span class="font-bold" id="modalDest">Torre 1 - Apto 101</span>
                </div>
                <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2">
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-xs text-slate-500 font-bold uppercase">Tiempo Total</span>
                        <span class="text-sm font-bold text-slate-700" id="modalDuration">0h 0min</span>
                    </div>
                    <div class="flex justify-between items-center mt-3 pt-3 border-t border-slate-200">
                        <span class="text-sm font-bold text-slate-700">Total a Pagar</span>
                        <div class="text-right">
                             <span class="block text-2xl font-black text-emerald-600 leading-none" id="modalCost">$0</span>
                             <span class="text-[10px] font-bold text-emerald-500" id="modalStatus">¡GRATIS! (Menos de 2h)</span>
                        </div>
                    </div>
                </div>
            </div>
            <button onclick="confirmReleaseSpot()" class="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition-colors text-sm flex items-center justify-center gap-2 touch-manipulation">
                <i class="fa-solid fa-arrow-right-from-bracket"></i> REGISTRAR SALIDA
            </button>
        </div>
    </div>

    <script>
        // --- VARIABLES GLOBALES ---
        let isPlateValid = false;

        // --- INICIALIZACIÓN UNIFICADA ---
        document.addEventListener('DOMContentLoaded', () => {
            switchTab('search'); // Volvemos a Search por defecto o lo que prefieras
            
            const plateInput = document.getElementById('visitPlate');
            const searchInput = document.getElementById('searchInput');
            const aptoInput = document.getElementById('visitApto');
            const torreInput = document.getElementById('visitTorre');
            
            // Validaciones
            if (plateInput) plateInput.addEventListener('input', (e) => handlePlateInput(e, 'visitType'));
            if (searchInput) searchInput.addEventListener('input', (e) => handlePlateInput(e, 'searchType'));
            
            if (aptoInput) aptoInput.addEventListener('input', updateRegisterButton);
            if (torreInput) torreInput.addEventListener('change', updateRegisterButton); // Evento change para select
            
            // PWA
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('./sw.js')
                    .then(reg => console.log('SW ok'))
                    .catch(err => console.log('SW error:', err));
            }
        });

        // --- LÓGICA DE VALIDACIÓN DE PLACA (UNIFICADA) ---
        function clearAndFocusPlate() {
            resetInputState('visitPlate', 'visitType', 'plateHint');
            updateRegisterButton();
        }

        function clearAndFocusSearchPlate() {
            resetInputState('searchInput', 'searchType', 'searchPlateHint');
        }

        function resetInputState(inputId, typeName, hintId) {
            const input = document.getElementById(inputId);
            input.value = '';
            input.focus();
            isPlateValid = false;
            updateInputValidationStyle(input, null); 
            updatePlateHint(typeName, hintId);
        }

        function updatePlateHint(typeName, hintId) {
            const type = document.querySelector(`input[name="${typeName}"]:checked`).value;
            const hint = document.getElementById(hintId);
            if (!hint) return;
            
            if (type === 'CARRO') {
                hint.innerText = "Formato: ABC-123 (3 letras - 3 números)";
            } else {
                hint.innerText = "Formato: ABC-12D (3 letras - 2 números 1 letra)";
            }
        }

        function handlePlateInput(e, typeName) {
            const input = e.target;
            const type = document.querySelector(`input[name="${typeName}"]:checked`).value;
            
            // 1. Obtener caracteres alfanuméricos solamente
            let raw = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            
            // 2. Limitar longitud máxima (6 caracteres + guion = 7 visualmente)
            if (raw.length > 6) raw = raw.slice(0, 6);
            
            // 3. Construir valor con guion
            let formattedValue = "";
            if (raw.length > 3) {
                formattedValue = raw.slice(0, 3) + "-" + raw.slice(3);
            } else {
                formattedValue = raw;
            }

            // FIX ANTI-ATRAPAMIENTO: Si borra justo el guion, dejamos que borre
            if (e.inputType && e.inputType.startsWith('delete') && raw.length === 3) {
                formattedValue = raw;
            }

            // 4. Asignar valor formateado
            input.value = formattedValue;

            // 5. Validar Reglas Estrictas
            let isValid = false;
            
            if (type === 'CARRO') {
                // 3 Letras, Guion, 3 Numeros
                const carRegex = /^[A-Z]{3}-[0-9]{3}$/;
                isValid = carRegex.test(formattedValue);
            } else {
                // 3 Letras, Guion, 2 Numeros, 1 Letra
                const motoRegex = /^[A-Z]{3}-[0-9]{2}[A-Z]$/;
                isValid = motoRegex.test(formattedValue);
            }

            // 6. Actualizar estado
            if(typeName === 'visitType') isPlateValid = isValid; // Solo bloquea registro, no busqueda
            
            updateInputValidationStyle(input, isValid);
            if(typeName === 'visitType') updateRegisterButton();
        }

        function updateInputValidationStyle(input, isValid) {
            input.classList.remove('border-gray-200', 'border-red-500', 'border-green-500', 'text-red-600', 'text-green-600', 'focus:border-blue-500');
            
            if (input.value.length === 0) {
                input.classList.add('border-gray-200', 'focus:border-blue-500');
                return;
            }

            if (isValid) {
                input.classList.add('border-green-500', 'text-green-600');
            } else {
                input.classList.add('border-red-500', 'text-red-600');
            }
        }

        // --- DATOS ---
        const dbVehiculos = [
            { placa: "ABC-123", apto: "204", parqueadero: "101", torre: "1", estado: "PROPIETARIO", arrendatarioApto: null },
            { placa: "ZER-987", apto: "501", parqueadero: "102", torre: "2", estado: "ARRIENDO", arrendatarioApto: "302" },
            { placa: "RTY-456", apto: "404", parqueadero: "105", torre: "2", estado: "PROPIETARIO", arrendatarioApto: null },
            { placa: "MTX-85L", apto: "101", parqueadero: "103", torre: "1", estado: "PROPIETARIO", arrendatarioApto: null }
        ];

        let visitorSpots = Array.from({length: 16}, (_, i) => ({
            id: i + 1, status: 0, placa: null, apto: null, torre: null, tipo: 'CARRO', timeIn: null, timestamp: null
        }));

        // Mock inicial
        const now = new Date();
        visitorSpots[1] = { ...visitorSpots[1], status: 1, placa: "KLO-888", apto: "101", torre: "1", tipo: 'CARRO', timestamp: now.getTime() - (11700000), timeIn: "08:30 AM" };
        visitorSpots[5] = { ...visitorSpots[5], status: 1, placa: "MNO-444", apto: "PH-01", torre: "2", tipo: 'CARRO', timestamp: now.getTime() - (3600000), timeIn: "09:15 AM" };

        let selectedSpotId = null;
        let spotToReleaseId = null;
        let currentFilter = 'ALL';
        const PRICE_PER_HOUR = 2000;

        // --- FUNCIONES ---
        function switchTab(tab) {
            const screenSearch = document.getElementById('screen-search');
            const screenVisitors = document.getElementById('screen-visitors');
            const navSearch = document.getElementById('nav-search');
            const navVisitors = document.getElementById('nav-visitors');

            if (tab === 'search') {
                screenSearch.classList.remove('hidden');
                screenVisitors.classList.add('hidden');
                
                navSearch.classList.add('active', 'text-blue-600');
                navSearch.classList.remove('text-gray-400');
                navVisitors.classList.remove('active', 'text-blue-600');
                navVisitors.classList.add('text-gray-400');
            } else {
                screenSearch.classList.add('hidden');
                screenVisitors.classList.remove('hidden');
                
                navVisitors.classList.add('active', 'text-blue-600');
                navVisitors.classList.remove('text-gray-400');
                navSearch.classList.remove('active', 'text-blue-600');
                navSearch.classList.add('text-gray-400');
                renderGrid();
            }
        }

        function buscarPlaca() {
            try {
                const input = document.getElementById('searchInput').value.toUpperCase().trim();
                const container = document.getElementById('searchResult');
                if (!input) { showToast("Ingresa una placa", "error"); return; }
                const found = dbVehiculos.find(v => v.placa === input);
                container.classList.remove('hidden');

                if (found) {
                    let badge, info, border;
                    if (found.estado === 'ARRIENDO') {
                        border = 'border-yellow-400';
                        badge = `<div class="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full border border-yellow-200 inline-block mb-2">⚠️ EN ARRIENDO</div>`;
                        info = `<p class="text-[10px] text-yellow-800 font-bold uppercase">Uso Actual:</p><p class="text-3xl font-black text-gray-800">Apto ${found.arrendatarioApto}</p>`;
                    } else {
                        border = 'border-green-400';
                        badge = `<div class="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200 inline-block mb-2">✅ AUTORIZADO</div>`;
                        info = `<p class="text-[10px] text-gray-400 uppercase font-bold">Residente:</p><p class="text-2xl font-black text-slate-700">Apto ${found.apto}</p>`;
                    }
                    container.innerHTML = `<div class="bg-white rounded-2xl shadow-xl border-l-8 ${border} overflow-hidden p-5">
                        <div class="flex justify-between items-start mb-4">
                            <h3 class="text-3xl font-black text-gray-800">${found.placa}</h3>
                            <div class="text-right"><p class="text-[10px] uppercase font-bold text-gray-400">Parqueadero</p><p class="text-2xl font-bold text-blue-600">P-${found.parqueadero}</p></div>
                        </div>
                        ${badge}
                        <div class="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100">${info}</div>
                        <button onclick="document.getElementById('searchInput').value=''; document.getElementById('searchResult').innerHTML='';" class="mt-4 text-sm text-gray-500 font-medium w-full text-center">Nueva Consulta</button>
                    </div>`;
                } else {
                    container.innerHTML = `<div class="bg-white rounded-2xl p-6 text-center shadow-lg border-2 border-red-50"><i class="fa-solid fa-ban text-3xl text-red-400 mb-3 block"></i><h3 class="font-bold text-gray-800">No Encontrado</h3><p class="text-sm text-gray-500 mb-4">Placa no registrada.</p><button class="w-full bg-blue-600 text-white px-4 py-3 rounded-xl font-bold" onclick="switchTab('visitors')">Registrar Visita</button></div>`;
                }
            } catch (e) { console.error(e); }
        }

        function toggleFilter(type) {
            currentFilter = (currentFilter === type) ? 'ALL' : type;
            renderGrid();
        }

        function renderGrid() {
            const grid = document.getElementById('parkingGrid');
            if (!grid) return;
            grid.innerHTML = '';
            
            // Totales
            const freeCount = visitorSpots.filter(s => s.status === 0).length;
            const occCount = visitorSpots.filter(s => s.status === 1).length;
            document.getElementById('summaryFree').innerText = freeCount;
            document.getElementById('summaryOccupied').innerText = occCount;
            document.getElementById('spotsCount').innerText = `${freeCount} Libres`;

            // UI Filtros
            document.getElementById('filterFreeRow').className = `cursor-pointer transition-all border-l-4 ${currentFilter === 'FREE' ? 'bg-emerald-50/50 border-emerald-500' : 'hover:bg-gray-50 border-transparent'}`;
            document.getElementById('filterOccupiedRow').className = `cursor-pointer transition-all border-l-4 ${currentFilter === 'OCCUPIED' ? 'bg-rose-50/50 border-rose-500' : 'hover:bg-gray-50 border-transparent'}`;
            document.getElementById('filterStatus').classList.toggle('hidden', currentFilter === 'ALL');
            if(currentFilter !== 'ALL') {
                const isFree = currentFilter === 'FREE';
                document.getElementById('filterStatus').innerText = isFree ? 'FILTRO: DISPONIBLES' : 'FILTRO: OCUPADOS';
                document.getElementById('filterStatus').className = `text-[9px] px-2 py-0.5 rounded font-bold ${isFree ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`;
            }

            // Filtrado datos
            let data = visitorSpots;
            if (currentFilter === 'FREE') data = visitorSpots.filter(s => s.status === 0);
            if (currentFilter === 'OCCUPIED') data = visitorSpots.filter(s => s.status === 1);

            document.getElementById('emptyState').classList.toggle('hidden', data.length > 0);

            data.forEach(spot => {
                const el = document.createElement('div');
                el.className = `aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer relative touch-manipulation shadow-sm ${spot.status === 1 ? 'bg-rose-50 border-2 border-rose-200' : (selectedSpotId === spot.id ? 'bg-emerald-500 border-2 border-emerald-600 scale-95' : 'bg-emerald-50 border border-emerald-100')}`;
                
                if (spot.status === 1) {
                    // Elegir icono según tipo
                    const iconClass = spot.tipo === 'MOTO' ? 'fa-motorcycle' : 'fa-car';
                    el.innerHTML = `<span class="text-[9px] font-bold text-rose-300 absolute top-1 left-1.5">V${spot.id}</span><i class="fa-solid ${iconClass} text-rose-500 text-lg"></i><span class="text-[10px] font-black text-rose-800 bg-rose-100 px-1 rounded mt-1">${spot.placa}</span>`;
                    el.onclick = () => openReleaseModal(spot.id);
                } else if (selectedSpotId === spot.id) {
                    el.innerHTML = `<span class="text-[9px] font-bold text-emerald-200 absolute top-1 left-1.5">V${spot.id}</span><i class="fa-solid fa-check text-white text-2xl"></i>`;
                    el.onclick = () => selectSpot(spot.id);
                } else {
                    el.innerHTML = `<span class="text-sm font-bold text-emerald-400">V-${spot.id}</span>`;
                    el.onclick = () => selectSpot(spot.id);
                }
                grid.appendChild(el);
            });
            updateRegisterButton();
        }

        function selectSpot(id) {
            selectedSpotId = (selectedSpotId === id) ? null : id;
            document.getElementById('selectedSpotDisplay').innerText = selectedSpotId ? `V-${selectedSpotId}` : '---';
            document.getElementById('selectedSpotDisplay').classList.toggle('text-emerald-600', !!selectedSpotId);
            renderGrid();
        }

        function updateRegisterButton() {
            const btn = document.getElementById('btnRegister');
            // Validacion de placa por variable global
            const a = document.getElementById('visitApto').value;
            const t = document.getElementById('visitTorre').value;
            
            if (selectedSpotId && isPlateValid && a && t) {
                btn.disabled = false;
                btn.className = "w-full bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 touch-manipulation";
            } else {
                btn.disabled = true;
                btn.className = "w-full bg-gray-200 text-gray-400 font-bold py-4 rounded-xl transition-all shadow-none touch-manipulation";
            }
        }

        function registrarVisita() {
            const idx = visitorSpots.findIndex(s => s.id === selectedSpotId);
            if(idx > -1) {
                const now = new Date();
                const tipo = document.querySelector('input[name="visitType"]:checked').value;
                visitorSpots[idx] = { 
                    ...visitorSpots[idx], 
                    status: 1, 
                    placa: document.getElementById('visitPlate').value.toUpperCase(), 
                    apto: document.getElementById('visitApto').value,
                    torre: document.getElementById('visitTorre').value, 
                    tipo: tipo,
                    timeIn: now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}), 
                    timestamp: now.getTime() 
                };
                showToast(`Visita registrada en V-${selectedSpotId}`, 'success');
                clearAndFocusPlate();
                document.getElementById('visitApto').value = '';
                document.getElementById('visitTorre').value = '';
                selectedSpotId = null;
                renderGrid();
            }
        }

        function openReleaseModal(id) {
            const spot = visitorSpots.find(s => s.id === id);
            spotToReleaseId = id;
            document.getElementById('modalPlate').innerText = spot.placa;
            document.getElementById('modalSpot').innerText = `Puesto V-${id}`;
            // Mostrar info completa en modal
            const torreInfo = spot.torre ? `Torre ${spot.torre} - ` : '';
            document.getElementById('modalDest').innerText = `${torreInfo}Apto ${spot.apto}`;
            document.getElementById('modalTime').innerText = spot.timeIn;
            
            // Costo
            const now = new Date().getTime();
            const diffMins = Math.floor((now - spot.timestamp) / 60000);
            const hours = Math.floor(diffMins / 60);
            const mins = diffMins % 60;
            let cost = 0, txt = "¡GRATIS! (<2h)";
            if (diffMins > 120) {
                const extra = Math.ceil((diffMins - 120) / 60);
                cost = extra * PRICE_PER_HOUR;
                txt = `Cobro: ${extra}h extra`;
            }
            
            document.getElementById('modalDuration').innerText = `${hours}h ${mins}m`;
            const costEl = document.getElementById('modalCost');
            costEl.innerText = `$${cost}`;
            costEl.className = `block text-3xl font-black leading-none ${cost > 0 ? 'text-rose-600' : 'text-emerald-600'}`;
            document.getElementById('modalStatus').innerText = txt;
            document.getElementById('modalStatus').className = `text-[10px] font-bold ${cost > 0 ? 'text-rose-500' : 'text-emerald-500'}`;

            const m = document.getElementById('visitorModal');
            m.classList.remove('hidden');
            setTimeout(() => { m.classList.remove('opacity-0'); m.querySelector('div').classList.add('scale-100'); }, 10);
        }

        function closeModal() {
            const m = document.getElementById('visitorModal');
            m.classList.add('opacity-0'); m.querySelector('div').classList.remove('scale-100');
            setTimeout(() => m.classList.add('hidden'), 300);
            spotToReleaseId = null;
        }

        function confirmReleaseSpot() {
            if (spotToReleaseId) {
                const idx = visitorSpots.findIndex(s => s.id === spotToReleaseId);
                visitorSpots[idx] = { ...visitorSpots[idx], status: 0, placa: null, apto: null, torre: null, tipo: 'CARRO', timeIn: null, timestamp: null };
                showToast('Salida registrada', 'success');
                closeModal();
                renderGrid();
            }
        }

        function showToast(msg, type) {
            const t = document.getElementById('toast');
            document.getElementById('toastMsg').innerText = msg;
            document.getElementById('toastIcon').className = type === 'error' ? "fa-solid fa-circle-exclamation text-red-400" : "fa-solid fa-circle-check text-green-400";
            t.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-[-20px]');
            setTimeout(() => t.classList.add('opacity-0', 'pointer-events-none', 'translate-y-[-20px]'), 3000);
        }
    </script>
</body>
</html>
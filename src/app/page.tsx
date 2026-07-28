'use client'

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center relative overflow-hidden font-sans text-slate-900">
      
      {/* Fondo minimalista y limpio (Atmósfera sutil) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-chambray-100/50 rounded-full mix-blend-multiply filter blur-[100px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-50/50 rounded-full mix-blend-multiply filter blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Columna Izquierda: Copywriting y CTAs */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left animate-fade-in">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-chambray-100/50 border border-chambray-200/50 text-chambray-800 text-sm font-medium mb-2">
                <span className="flex w-2 h-2 rounded-full bg-chambray-600 mr-2 animate-pulse"></span>
                La nueva forma de moverse
              </div>
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-slate-900">
                Movilidad inteligente para tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-chambray-700 to-chambray-500">día a día.</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Decarrerita te conecta con choferes verificados. Viaja con seguridad y disfruta de una experiencia de traslado sin complicaciones.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <Link 
                href="/login" 
                className="group flex items-center justify-center px-8 py-3.5 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 transition-all duration-200"
              >
                Iniciar Sesión
                <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link 
                href="/register" 
                className="group flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-slate-700 font-medium border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
              >
                Crear Cuenta
              </Link>
            </div>

            {/* Mini estadísticas integradas limpiamente */}
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-8 mt-8 border-t border-slate-200/60">
              <div>
                <div className="text-2xl font-bold text-slate-900">10k+</div>
                <div className="text-sm text-slate-500 font-medium">Usuarios</div>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div>
                <div className="text-2xl font-bold text-slate-900">5k+</div>
                <div className="text-sm text-slate-500 font-medium">Viajes</div>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div>
                <div className="text-2xl font-bold text-slate-900">98%</div>
                <div className="text-sm text-slate-500 font-medium">Satisfacción</div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Mockup de la App UI */}
          <div className="lg:col-span-5 relative mx-auto w-full max-w-[320px] animate-slide-up">
            <div className="relative bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border-[8px] border-slate-100 overflow-hidden flex flex-col h-[600px]">
              
              {/* Top Bar Simulator */}
              <div className="absolute top-0 inset-x-0 h-6 bg-white z-20 flex justify-center">
                <div className="w-20 h-4 bg-slate-100 rounded-b-xl"></div>
              </div>

              {/* Fake Map Area */}
              <div className="flex-1 bg-slate-50 relative overflow-hidden">
                {/* Patrón de mapa minimalista */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                {/* Ruta simulada */}
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-black rounded-full z-10 shadow-md"></div>
                <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-chambray-600 rounded-full z-10 shadow-md border-2 border-white"></div>
                <svg className="absolute inset-0 w-full h-full text-chambray-400 opacity-60 stroke-current" style={{ strokeDasharray: '6 6', strokeWidth: '3', fill: 'none' }}>
                  <path d="M 90 160 C 120 250, 200 250, 230 380" strokeLinecap="round" />
                </svg>
              </div>

              {/* App Bottom Sheet (Tarjeta de viaje) */}
              <div className="bg-white p-6 rounded-t-3xl shadow-[0_-15px_40px_rgba(0,0,0,0.06)] relative z-20">
                <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5"></div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 bg-black rounded-full shadow-sm"></div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Recogida</p>
                      <p className="text-sm font-semibold text-slate-900">Alta Vista</p>
                    </div>
                  </div>
                  
                  <div className="ml-1 w-px h-6 bg-slate-200"></div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 bg-chambray-600 rounded-full shadow-sm"></div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Destino</p>
                      <p className="text-sm font-semibold text-slate-900">UNEG</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-xl">🚘</div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Decarrerita X</p>
                      <p className="text-xs text-slate-500">3 min de distancia</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-slate-900">$4.50</p>
                </div>

                <button className="w-full mt-4 bg-slate-900 text-white font-medium py-3 rounded-xl hover:bg-slate-800 transition-colors">
                  Confirmar Viaje
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de características (Minimalista) */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto border-t border-slate-200/60 pt-16">
          <div className="text-left group">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center mb-5 group-hover:bg-chambray-50 group-hover:text-chambray-700 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Seguridad garantizada</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Choferes estrictamente verificados y monitoreo de rutas en tiempo real para tu tranquilidad.</p>
          </div>
          
          <div className="text-left group">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center mb-5 group-hover:bg-chambray-50 group-hover:text-chambray-700 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Rapidez y eficiencia</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Algoritmos optimizados que te conectan con el vehículo más cercano en segundos.</p>
          </div>
          
          <div className="text-left group">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center mb-5 group-hover:bg-chambray-50 group-hover:text-chambray-700 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Precios transparentes</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Conoce el costo exacto de tu viaje antes de confirmar, sin sorpresas ni tarifas ocultas.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-up {
          animation: slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
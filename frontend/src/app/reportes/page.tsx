"use client";

import { BarChart3, TrendingUp, Users, FileCheck, AlertCircle, Download } from "lucide-react";

export default function ReportesPage() {
    const stats = [
        { label: "Total Socios", value: "1,250", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Solicitudes Pendientes", value: "45", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Créditos Aprobados", value: "890", icon: FileCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Crecimiento Mensual", value: "+12.5%", icon: TrendingUp, color: "text-[#004d40]", bg: "bg-green-50" },
    ];

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Panel de Reportes</h1>
                    <p className="text-slate-500">Visualiza el rendimiento y estadísticas de la cooperativa.</p>
                </div>
                <button className="flex items-center gap-2 bg-[#004d40] text-white px-5 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all">
                    <Download className="w-4 h-4" />
                    Exportar PDF
                </button>
            </div>

            {/* Grid de Métricas Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className={`p-4 rounded-2xl ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Gráficos Simulados */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm min-h-[300px] flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-700">Solicitudes por Barrio</h2>
                        <BarChart3 className="w-5 h-5 text-slate-400" />
                    </div>
                    {/* Placeholder para un gráfico real como Recharts */}
                    <div className="flex-1 flex items-end gap-4 pt-4">
                        <div className="flex-1 bg-[#004d40] rounded-t-lg" style={{ height: '60%' }}></div>
                        <div className="flex-1 bg-slate-200 rounded-t-lg" style={{ height: '40%' }}></div>
                        <div className="flex-1 bg-[#004d40] rounded-t-lg" style={{ height: '85%' }}></div>
                        <div className="flex-1 bg-slate-200 rounded-t-lg" style={{ height: '30%' }}></div>
                        <div className="flex-1 bg-[#004d40] rounded-t-lg" style={{ height: '55%' }}></div>
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase">
                        <span>San Vicente</span>
                        <span>Lambaré</span>
                        <span>Centro</span>
                        <span>Sajonia</span>
                        <span>Villa Morra</span>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-700 mb-6">Actividad de la IA</h2>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-700">OCR: Validación de Cédulas</p>
                                <div className="w-full h-2 bg-slate-100 rounded-full mt-1">
                                    <div className="w-[98%] h-full bg-green-500 rounded-full"></div>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-slate-500">98% Precisión</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-700">RAG: Análisis Crediticio</p>
                                <div className="w-full h-2 bg-slate-100 rounded-full mt-1">
                                    <div className="w-[85%] h-full bg-blue-500 rounded-full"></div>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-slate-500">85% Eficiencia</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
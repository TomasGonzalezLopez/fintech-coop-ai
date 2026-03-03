"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, FileCheck, AlertCircle, Download, Loader2 } from "lucide-react";

export default function ReportesPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/reportes/")
            .then(res => res.json())
            .then(stats => {
                setData(stats);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error al conectar con la API:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-4 text-slate-500">
                <Loader2 className="w-10 h-10 animate-spin text-[#004d40]" />
                <p className="font-medium">Sincronizando datos de la cooperativa...</p>
            </div>
        );
    }

    const statsCards = [
        { label: "Total Socios", value: data?.total_socios || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Solicitudes Pendientes", value: data?.solicitudes_pendientes || 0, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Créditos Aprobados", value: data?.creditos_aprobados || 0, icon: FileCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Crecimiento", value: "+12.5%", icon: TrendingUp, color: "text-[#004d40]", bg: "bg-green-50" },
    ];

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Panel de Reportes</h1>
                    <p className="text-slate-500">Estadísticas reales basadas en la base de datos central.</p>
                </div>
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 bg-[#004d40] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#00332a] transition-all shadow-md active:scale-95"
                >
                    <Download className="w-4 h-4" />
                    Exportar Informe
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm min-h-[450px] flex flex-col">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-lg font-bold text-slate-700">Distribución por Barrios</h2>
                        <BarChart3 className="w-5 h-5 text-slate-400" />
                    </div>

                    <div className="flex-1 flex items-end gap-3 sm:gap-6 px-2 h-[250px] mb-4">
                        {data?.por_barrio && data.por_barrio.length > 0 ? (
                            data.por_barrio.map((item: any, i: number) => {
                                const maxVal = Math.max(...data.por_barrio.map((b: any) => b.total)) || 1;
                                const heightPercentage = (item.total / maxVal) * 100;

                                return (
                                    <div key={i} className="flex-1 flex flex-col justify-end h-full group relative">
                                        <span className="text-[11px] font-bold text-[#004d40] text-center mb-1 opacity-100 transition-opacity">
                                            {item.total}
                                        </span>

                                        <div
                                            className="w-full bg-[#004d40] rounded-t-xl transition-all duration-1000 ease-out hover:bg-emerald-700 cursor-pointer relative shadow-sm"
                                            style={{ height: `${heightPercentage}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/5 rounded-t-xl" />
                                        </div>

                                        <span className="text-[10px] font-bold text-slate-400 uppercase mt-3 h-10 text-center flex items-start justify-center overflow-hidden leading-tight">
                                            {item.barrio}
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                No hay datos geográficos para mostrar.
                            </div>
                        )}
                    </div>
                </div>


                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-700 mb-6">Eficiencia de Procesos IA</h2>
                        <div className="space-y-8">
                            <IAStatItem label="OCR: Validación de Cédulas" progress={98} color="bg-green-500" />
                            <IAStatItem label="RAG: Análisis Crediticio" progress={85} color="bg-blue-500" />
                            <IAStatItem label="Clasificación de Riesgo" progress={92} color="bg-purple-500" />
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-xs text-slate-500 text-center italic leading-relaxed">
                            "Los algoritmos de IA analizan las solicitudes en tiempo real para optimizar la aprobación de créditos."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function IAStatItem({ label, progress, color }: { label: string, progress: number, color: string }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-slate-700">{label}</p>
                <span className="text-xs font-bold text-slate-500">{progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} transition-all duration-1000 ease-in-out`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
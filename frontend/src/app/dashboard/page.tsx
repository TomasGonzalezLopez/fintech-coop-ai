"use client";

import { useState, useEffect } from "react";
import Box from "@/components/ui/box";
import LargeBox from "@/components/boxes/largebox";
import { Loader2, UserPlus, RefreshCcw } from "lucide-react";

export default function DashboardPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchDashboardData = () => {
        setLoading(true);
        setError(false);
        fetch("http://127.0.0.1:8000/api/reportes/")
            .then((res) => {
                if (!res.ok) throw new Error("Error en la respuesta del servidor");
                return res.json();
            })
            .then((stats) => {
                setData(stats);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error cargando dashboard:", err);
                setError(true);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="flex h-full min-h-[400px] flex-col items-center justify-center p-20 text-slate-400">
            <Loader2 className="animate-spin mb-4 w-12 h-12 text-[#004d40]" />
            <p className="font-medium animate-pulse">Sincronizando con la base de datos...</p>
        </div>
    );

    if (error) return (
        <div className="flex h-full flex-col items-center justify-center p-20 text-red-500">
            <p className="font-bold text-xl mb-4">No se pudo conectar con el servidor</p>
            <button
                onClick={fetchDashboardData}
                className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors text-slate-700"
            >
                <RefreshCcw className="w-4 h-4" /> Reintentar
            </button>
        </div>
    );

    return (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg h-full flex flex-col animate-in fade-in duration-500">
            {/* Header del Dashboard */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Panel administrativo</h1>
                    <p className="text-sm text-gray-500">Gestión y monitoreo de la Cooperativa</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchDashboardData}
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all"
                        title="Actualizar datos"
                    >
                        <RefreshCcw className="w-5 h-5" />
                    </button>
                    <button className="bg-[#004d40] text-white px-5 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 active:scale-95">
                        <UserPlus className="w-4 h-4" />
                        Agregar Socio
                    </button>
                </div>
            </div>

            {/* boxes de estadistica */}
            <div className="gap-6 flex flex-wrap lg:flex-nowrap">
                <Box
                    title="Socios Totales"
                    value={data?.total_socios?.toLocaleString() || "0"}
                    change="+50 Socios"
                />
                <Box
                    title="Préstamos Totales"
                    value={data?.total_prestamos?.toLocaleString() || "0"}
                    change="Análisis por IA activo"
                />
                <Box
                    title="Pendientes"
                    value={data?.pendientes?.toLocaleString() || "0"}
                    change="Revisiones urgentes"
                />
            </div>

            {/*Lista de solocitudes*/}
            <div className="mt-8 overflow-hidden flex-1 min-h-0">
                <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-inner h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-slate-700">Últimas Solicitudes</h1>
                        <span className="text-xs font-bold text-[#004d40] bg-emerald-50 px-3 py-1 rounded-full uppercase">
                            Tiempo Real
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-4 space-y-4 custom-scrollbar">
                        {data?.ultimas_solicitudes && data.ultimas_solicitudes.length > 0 ? (
                            data.ultimas_solicitudes.map((solicitud: any) => (
                                <div
                                    key={solicitud.id}
                                    className="animate-in slide-in-from-bottom-2 duration-300 fill-mode-both"
                                >
                                    <LargeBox
                                        title={solicitud.nombre}
                                        subtitle={solicitud.subtitulo}
                                    />
                                    <div className="border-b border-slate-100 mt-4 opacity-50"></div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-2">
                                <p className="italic font-medium">No se encontraron solicitudes recientes.</p>
                                <p className="text-xs">Asegúrate de haber ejecutado el script de población de datos.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
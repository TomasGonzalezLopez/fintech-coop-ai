import Box from "@/components/ui/box";
import LargeBox from "@/components/boxes/largebox";
export default function DashboardPage() {
    return (

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg h-full flex flex-col">
            <div className="flex items-center justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Panel administrativo</h1>
                    <p className="text-sm text-gray-500">Gestión de la Cooperativa</p>
                </div>
                <div>
                    <button className="bg-[var(--color-green)] text-white px-4 py-2 rounded-lg">Agregar Socio</button>
                </div>
            </div>
            <div className="gap-10 flex flex-wrap">
                <Box title="Socios Totales" value="1,248" change="+12 este mes" />
                <Box title="Préstamos Totales" value="1,248" change="+12 este mes" />
                <Box title="Ahorros Totales" value="1,248" change="+12 este mes" />
            </div>
            <div className="mt-8 overflow-hidden">
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-inner h-full flex flex-col">
                    <h1 className="text-2xl font-bold">Últimas Solicitudes</h1>
                    <div className="mt-4 flex-1 overflow-hidden">
                        <div className="overflow-y-auto h-full pr-4">
                            <LargeBox title="Solicitud 1" subtitle=" Solicitud 1" />
                            <div className="border-b border-gray-300 my-4"></div>
                            <LargeBox title="Solicitud 1" subtitle=" Solicitud 1" />
                            <div className="border-b border-gray-300 my-4"></div>
                            <LargeBox title="Solicitud 1" subtitle=" Solicitud 1" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
import { NavItem } from '../utils/NavItem'
import {
    LayoutDashboard,
    FilePlus,
    Users,
    CreditCard,
    Bot,
    BarChart,
} from 'lucide-react';
const SideBar = () => {
    return (
        <div className="hidden md:flex flex-col w-72 h-screen  bg-gradient-to-b from-[var(--color-green)] to-black text-white p-8 rounded-r-3xl shadow-xl">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Cooperativa</h1>
            </div>
            <nav className='mt-8'>
                <ul>
                    <NavItem href="/dashboard" label="Dashboard" icon={<LayoutDashboard />} />
                    <NavItem href="/solicitudes" label="Nueva Solicitud" icon={<FilePlus />} />
                    <NavItem href="/socios" label="Gestión de Socios" icon={<Users />} />
                    <NavItem href="/creditos" label="Préstamos" icon={<CreditCard />} />
                    <NavItem href="/consultas" label="Consultas IA" icon={<Bot />} />
                    <NavItem href="/reportes" label="Reportes" icon={<BarChart />} />
                </ul>
            </nav>
        </div>
    )
}

export default SideBar
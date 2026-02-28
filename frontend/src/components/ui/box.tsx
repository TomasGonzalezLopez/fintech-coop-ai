

interface BoxProps {
    title: string;
    value: string;
    change: string;
}
export default function Box({ title, value, change }: BoxProps) {
    return (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-inner">
            <p className="text-slate-500 text-sm font-medium uppercase">{title}</p>
            <h3 className="text-4xl font-black text-slate-900 mt-2">{value}</h3>
            <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-lg mt-4 inline-block">
                {change}
            </span>
        </div>
    )
}
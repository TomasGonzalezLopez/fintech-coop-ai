
interface LargeBoxProps {
    title: string;
    subtitle: string;
}

export default function LargeBox({ title, subtitle }: LargeBoxProps) {
    return (
        <div className="mt-4 flex justify-between items-center">
            <div>
                <h3 className="text-xl font-bold text-slate-700">{title}</h3>
                <p className="mt-2text-slate-500 text-sm font-medium mt-2">{subtitle}</p>
            </div>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4">Ver</button>

        </div>
    )

}
"use client";

import { useState } from "react";

export default function SolicitudesPage() {
    const [showResult, setShowResult] = useState(false);

    const [tipo, setTipo] = useState("");
    const [plazo, setPlazo] = useState("");
    const [monto, setMonto] = useState("");

    const [resultado, setResultado] = useState({ monto: 0, cuotas: 0, cuotaMensual: 0 });

    const formatMoneda = (valor: number) => {
        return new Intl.NumberFormat('es-PY', {
            style: 'currency',
            currency: 'PYG',
            maximumFractionDigits: 0
        }).format(valor).replace('PYG', 'Gs.');
    };

    const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valorPuro = e.target.value.replace(/\D/g, "");

        if (!valorPuro) {
            setMonto("");
            return;
        }


        const valorFormateado = new Intl.NumberFormat("es-PY").format(Number(valorPuro));

        setMonto(valorFormateado);
    };

    const calcularCredito = () => {
        const principal = parseFloat(monto.replace(/\D/g, ''));
        const meses = parseInt(plazo);

        if (!principal || !meses || !tipo || tipo === "Seleccione el tipo de crédito") {
            alert("Por favor, completa todos los campos para calcular.");
            return;
        }

        let tasaAnual = 0.18;
        if (tipo === "Crédito de Vivienda") tasaAnual = 0.09;
        if (tipo === "Crédito de Vehículo") tasaAnual = 0.13;

        const tasaMensual = tasaAnual / 12;
        const cuota = (principal * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -meses));

        setResultado({
            monto: principal,
            cuotas: meses,
            cuotaMensual: cuota
        });

        setShowResult(true);
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg h-full flex flex-col">
                <h1 className="text-3xl font-bold mb-8 border-b-3 border-[var(--color-green)] w-fit pb-2">
                    Simulador de créditos
                </h1>
                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="flex flex-col gap-4 w-full lg:w-1/3">
                        <select
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            className="w-full p-4 h-12 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-[var(--color-green)]"
                        >
                            <option>Seleccione el tipo de crédito</option>
                            <option>Crédito de Consumo</option>
                            <option>Crédito de Vivienda</option>
                            <option>Crédito de Vehículo</option>
                        </select>

                        <select
                            value={plazo}
                            onChange={(e) => setPlazo(e.target.value)}
                            className="w-full px-4 h-14 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-[var(--color-green)] transition-all"
                        >
                            <option>Seleccione el plazo</option>
                            {[...Array(60)].map((_, i) => (
                                <option key={i} value={i + 1}>{i + 1} meses</option>
                            ))}
                        </select>

                        <input
                            type="text"
                            value={monto}
                            onChange={handleMontoChange}
                            placeholder="Monto a solicitar (Ej: 10.000.000)"
                            className="w-full p-4 h-12 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-[var(--color-green)] transition-all"
                        />
                        <button
                            onClick={calcularCredito}
                            className="bg-[var(--color-green)] text-white px-10 py-3 rounded-full font-bold shadow-lg hover:brightness-110 transition-all active:scale-95"
                        >
                            Calcular
                        </button>
                    </div>

                    {showResult && (
                        <div className="flex-1 animate-in fade-in slide-in-from-right duration-500">
                            <div className="bg-[#333d42] text-white rounded-[2rem] p-8 shadow-xl">
                                <div className="grid grid-cols-2 border-b border-white/10 gap-8 pb-4">
                                    <div>
                                        <p className="text-sm text-slate-400">Monto</p>
                                        <p className="text-2xl font-bold text-orange-400">
                                            {formatMoneda(resultado.monto)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400">Cuotas</p>
                                        <p className="text-2xl font-bold">{resultado.cuotas}</p>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <p className="text-sm text-slate-400">Cuota mensual estimada</p>
                                    <p className="text-3xl font-bold text-green-400">
                                        {formatMoneda(resultado.cuotaMensual)}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 bg-green-50 border border-green-100 p-4 rounded-xl flex gap-3 items-start">
                                <span className="text-green-600 text-lg">ⓘ</span>
                                <p className="text-xs text-slate-600">
                                    Valores de referencia. Las tasas varían según el tipo de crédito.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
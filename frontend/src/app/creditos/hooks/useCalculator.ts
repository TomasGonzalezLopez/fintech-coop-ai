import { useState } from "react";


export const useCalculadora = () => {
    const [tipo, setTipo] = useState("");
    const [plazo, setPlazo] = useState(12);
    const [monto, setMonto] = useState("");
    const [resultado, setResultado] = useState({ monto: 0, cuotas: 0, cuotaMensual: 0 });
    const [showResult, setShowResult] = useState(false);

    const formatMoneda = (valor: number) => {
        return new Intl.NumberFormat('es-PY', {
            style: 'currency',
            currency: 'PYG',
            maximumFractionDigits: 0
        }).format(valor).replace('PYG', 'Gs.');
    };

    const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valorPuro = e.target.value.replace(/\D/g, "");
        if (!valorPuro) { setMonto(""); return; }
        setMonto(new Intl.NumberFormat("es-PY").format(Number(valorPuro)));
    };

    const calcularCredito = () => {
        const principal = parseFloat(monto.replace(/\D/g, ''));
        const meses = Number(plazo);

        if (!principal || isNaN(meses) || !tipo) {
            alert("Por favor, selecciona el tipo de crédito y el monto.");
            return;
        }

        let tasaAnual = 0.18;
        if (tipo === "vivienda") tasaAnual = 0.09;
        if (tipo === "vehiculo") tasaAnual = 0.13;

        const tasaMensual = tasaAnual / 12;
        const cuota = (principal * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -meses));

        setResultado({
            monto: principal,
            cuotas: meses,
            cuotaMensual: Math.round(cuota)
        });
        setShowResult(true);
    };

    return {
        tipo, setTipo,
        plazo, setPlazo,
        monto, setMonto,
        resultado, showResult,
        formatMoneda, handleMontoChange, calcularCredito
    };
};
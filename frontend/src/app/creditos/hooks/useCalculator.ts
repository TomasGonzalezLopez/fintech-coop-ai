import { useState } from "react";


export const useCalculadora = () => {
    const [tipo, setTipo] = useState("");
    // 1. Cambiamos el estado inicial a un número para evitar errores de tipo
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
        // Guardamos el formato con puntos para la vista
        setMonto(new Intl.NumberFormat("es-PY").format(Number(valorPuro)));
    };

    const calcularCredito = () => {
        // 2. Limpiamos el monto para tener un número puro
        const principal = parseFloat(monto.replace(/\D/g, ''));

        // 3. 'plazo' ya es un número en nuestro estado, pero por seguridad 
        // lo forzamos a entero si viene de un input range
        const meses = Number(plazo);

        if (!principal || isNaN(meses) || !tipo) {
            alert("Por favor, selecciona el tipo de crédito y el monto.");
            return;
        }

        // Definición de tasas según mercado paraguayo 2026
        let tasaAnual = 0.18; // Consumo
        if (tipo === "vivienda") tasaAnual = 0.09;
        if (tipo === "vehiculo") tasaAnual = 0.13;

        // Fórmula de amortización francesa
        const tasaMensual = tasaAnual / 12;
        const cuota = (principal * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -meses));

        setResultado({
            monto: principal,
            cuotas: meses,
            cuotaMensual: Math.round(cuota) // Redondeamos para Guaraníes
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
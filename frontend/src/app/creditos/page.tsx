"use client";

import { useRef, useState } from "react";
import { useSolicitudForm } from "@/app/solicitudes/hooks/solicitudForm";
import { useCalculadora } from "@/app/creditos/hooks/useCalculator";
import { useSocioVerificador } from "@/app/creditos/hooks/useSocioValidator";
import { useSolicitudActions } from "@/app/creditos/hooks/saveSolicitudPrestamo";

export default function SolicitudesPage() {
    const { step, setStep, isProcessing, formData, setFormData, handleImageUpload } = useSolicitudForm();
    const calc = useCalculadora();
    const socio = useSocioVerificador(setFormData);
    const formularioRef = useRef<HTMLDivElement>(null);
    const { guardarEnBaseDeDatos } = useSolicitudActions();

    const enviarSolicitud = async () => {
        try {
            if (!formData.nombre || !formData.ingresos) {
                alert("Por favor, completa los datos de identidad y capacidad de pago.");
                return;
            }

            const payload = {
                formData: {
                    ...formData,
                    monto: formData.montoSolicitado || calc.monto || "0",
                    plazo: formData.plazoSolicitado || calc.plazo || "12"
                },
                socio: {
                    cedulaInput: formData.cedula || socio.cedulaInput
                },
                calc: {
                    resultado: {
                        monto: formData.montoSolicitado || calc.monto || "0",
                        cuotas: formData.plazoSolicitado || calc.plazo || "12",
                        cuotaMensual: "0"
                    },
                    tipo: formData.tipoCredito || calc.tipo || "Consumo"
                }
            };

            const exito = await guardarEnBaseDeDatos(payload);
            if (exito) {
                alert("✅ Solicitud enviada con éxito");
                window.location.reload();
            }
        } catch (error) {
            alert("❌ Error al procesar la solicitud");
        }
    };

    return (
        <div className="flex flex-col gap-10 pb-20">
            {/* --- SECCIÓN 1: SIMULADOR (Tu UI Original) --- */}
            <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg">
                <h1 className="text-3xl font-bold mb-8 border-b-3 border-[var(--color-green)] w-fit pb-2">Simulador de Créditos</h1>
                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="flex flex-col gap-6 w-full lg:w-1/3">

                        {/* Selección de Tipo */}
                        <div>
                            <label className="text-sm font-medium text-slate-500 mb-2 block">Tipo de Crédito</label>
                            <select
                                value={calc.tipo}
                                onChange={(e) => calc.setTipo(e.target.value)}
                                className="w-full p-4 h-14 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[var(--color-green)] bg-slate-50"
                            >
                                <option value="">Seleccione el tipo</option>
                                <option value="consumo">Crédito de Consumo</option>
                                <option value="vivienda">Crédito de Vivienda</option>
                                <option value="vehiculo">Crédito para Vehículo</option>
                            </select>
                        </div>

                        {/* Selector de Plazo con Slider */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-slate-500">Plazo del Crédito</label>
                                <span className="text-[var(--color-green)] font-bold">{calc.plazo} meses</span>
                            </div>
                            <select
                                value={calc.plazo}
                                onChange={(e) => calc.setPlazo(Number(e.target.value))}
                                className="w-full p-4 h-14 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[var(--color-green)] bg-slate-50"
                            >
                                {/* Generamos un array de 120 posiciones y lo recorremos */}
                                {Array.from({ length: 120 }, (_, i) => i + 1) // Crea números del 1 al 120
                                    .filter(mes => mes >= 3) // Filtramos para que empiece desde 3 meses
                                    .map((mes) => (
                                        <option key={mes} value={mes}>
                                            {mes} meses {mes % 12 === 0 ? `(${mes / 12} ${mes / 12 === 1 ? 'año' : 'años'})` : ''}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>

                        {/* Monto */}
                        <div>
                            <label className="text-sm font-medium text-slate-500 mb-2 block">Monto a Solicitar</label>
                            <input
                                type="text"
                                value={calc.monto}
                                onChange={calc.handleMontoChange}
                                placeholder="Ej: 5.000.000 Gs."
                                className="w-full p-4 h-14 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[var(--color-green)]"
                            />
                        </div>

                        <button
                            onClick={calc.calcularCredito}
                            className="bg-[var(--color-green)] text-white p-4 rounded-xl font-bold hover:brightness-110 shadow-md transition-all active:scale-95"
                        >
                            Calcular Cuota
                        </button>
                    </div>

                    {calc.showResult && (
                        <div className="flex-1 animate-in fade-in slide-in-from-right duration-500">
                            <div className="bg-[#333d42] text-white rounded-[2rem] p-8 shadow-xl flex flex-col justify-center h-full border-l-8 border-[var(--color-green)]">
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Cuota Mensual Estimada</p>
                                <p className="text-5xl font-extrabold text-green-400">
                                    {calc.formatMoneda(calc.resultado.cuotaMensual)}
                                    <span className="text-sm text-slate-400 font-normal ml-2">/ mes</span>
                                </p>

                                <div className="mt-6 space-y-2 border-t border-slate-600 pt-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Plazo elegido:</span>
                                        <span>{calc.plazo} meses</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Total a devolver:</span>
                                        <span className="font-bold text-white">{calc.formatMoneda(calc.resultado.cuotaMensual * calc.plazo)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep(1)}
                                    className="mt-8 w-full bg-[var(--color-green)] text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-900/20"
                                >
                                    Solicitar este crédito ahora
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* --- SECCIÓN 2: FORMULARIO CON OCR INTEGRADO --- */}
            <div ref={formularioRef}>
                {step >= 1 && (
                    <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg animate-in slide-in-from-bottom duration-700">
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Solicitar préstamo</h2>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-[var(--color-green)] text-white' : 'bg-slate-200 text-slate-500'}`}>1</span>
                                    <span className={`font-semibold ${step >= 1 ? 'text-slate-800' : 'text-slate-400'}`}>Paso 1</span>
                                </div>
                                <div className="h-[2px] w-12 bg-slate-200"></div>
                                <div className="flex items-center gap-2">
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-[var(--color-green)] text-white' : 'bg-slate-200 text-slate-500'}`}>2</span>
                                    <span className={`font-semibold ${step >= 2 ? 'text-slate-800' : 'text-slate-400'}`}>Paso 2</span>
                                </div>
                            </div>
                        </div>
                        {step === 1 && (
                            <div className="space-y-6">
                                {/* BUSCADOR INICIAL */}
                                {!formData.nombre && !socio.socioNotFound && (
                                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center">
                                        <p className="text-slate-600 mb-4 font-medium">Para comenzar, ingresa tu Cédula:</p>
                                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                                            <input
                                                type="text"
                                                value={socio.cedulaInput}
                                                onChange={(e) => socio.setCedulaInput(e.target.value.replace(/\D/g, ""))}
                                                className="flex-1 p-4 rounded-xl border border-slate-300 outline-none text-center text-xl"
                                                placeholder="N° de Cédula"
                                            />
                                            <button onClick={socio.verificarSocio} className="bg-slate-800 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-700">
                                                Validar
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* CASO: NO ES SOCIO -> ACTIVAR OCR */}
                                {socio.socioNotFound && !formData.nombre && (
                                    <div className="space-y-6 animate-in zoom-in duration-300">
                                        <div className="bg-orange-50 border border-orange-200 p-5 rounded-xl flex gap-4 text-orange-800">
                                            <span className="text-2xl">👤</span>
                                            <div>
                                                <p className="font-bold">No te encontramos en nuestro sistema.</p>
                                                <p className="text-sm">Escanea tu cédula para registrar tus datos automáticamente y continuar.</p>
                                            </div>
                                        </div>

                                        <div className="relative border-4 border-dashed border-slate-200 rounded-3xl p-16 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-all group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={isProcessing}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />

                                            {isProcessing ? (
                                                <div className="text-center">
                                                    <div className="w-12 h-12 border-4 border-[var(--color-green)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                                    <p className="text-[var(--color-green)] font-bold">La IA está leyendo tu cédula...</p>
                                                </div>
                                            ) : (
                                                <div className="text-center group-hover:scale-105 transition-transform">
                                                    <div className="text-6xl mb-4">📸</div>
                                                    <p className="text-slate-600 font-bold text-lg">Subir foto de Cédula (Frente)</p>
                                                    <p className="text-slate-400 text-sm">Formatos aceptados: JPG, PNG</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* RESULTADO DE VALIDACIÓN (SOCIO O OCR EXITOSO) */}
                                {formData.nombre && (
                                    <div className="bg-green-50 border border-green-200 p-8 rounded-3xl flex flex-col sm:flex-row items-center gap-6 animate-in zoom-in">
                                        <div className="bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg">✓</div>
                                        <div className="text-center sm:text-left">
                                            <p className="text-green-600 text-sm uppercase tracking-widest font-bold">Identidad Confirmada</p>
                                            <p className="text-slate-800 font-black text-2xl">{formData.nombre}</p>
                                            <p className="text-slate-500">Cédula: {formData.cedula || socio.cedulaInput}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end pt-6 border-t">
                                    <button
                                        onClick={() => setStep(2)}
                                        disabled={!formData.nombre || isProcessing}
                                        className="bg-[var(--color-green)] text-white px-12 py-4 rounded-xl font-bold shadow-lg disabled:opacity-30 hover:scale-105 active:scale-95 transition-all"
                                    >
                                        Siguiente Paso: Capacidad de Pago →
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8 animate-in fade-in">
                                <div className="bg-white border border-[var(--color-green)] p-6 rounded-2xl text-[var(--color-green)] text-center font-bold text-lg">
                                    Detalles de la Solicitud
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Bloque Préstamo */}
                                    <div className="space-y-4">
                                        <p className="font-bold text-slate-700 ml-1">¿Qué préstamo deseas?</p>
                                        <input
                                            type="number"
                                            onInput={(e) => {
                                                const value = e.currentTarget.value.replace(/[^0-9]/g, '');
                                                e.currentTarget.value = value;
                                            }}
                                            placeholder="Monto deseado (Gs.)"
                                            className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[var(--color-green)] outline-none"
                                            onChange={(e) => setFormData({ ...formData, montoSolicitado: e.target.value })}
                                        />
                                        <select
                                            className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[var(--color-green)] outline-none"
                                            onChange={(e) => setFormData({ ...formData, plazoSolicitado: e.target.value })}
                                        >
                                            <option value="12">12 meses</option>
                                            <option value="24">24 meses</option>
                                            <option value="36">36 meses</option>
                                            <option value="48">48 meses</option>
                                        </select>
                                    </div>

                                    {/* Bloque Financiero */}
                                    <div className="space-y-4">
                                        <p className="font-bold text-slate-700 ml-1">Tus finanzas mensuales</p>
                                        <input
                                            type="number"
                                            onInput={(e) => {
                                                const value = e.currentTarget.value.replace(/[^0-9]/g, '');
                                                e.currentTarget.value = value;
                                            }}
                                            placeholder="Ingresos Mensuales (Gs.)"
                                            className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[var(--color-green)] outline-none"
                                            onChange={(e) => setFormData({ ...formData, ingresos: e.target.value })}
                                        />
                                        <input
                                            type="number"
                                            onInput={(e) => {
                                                const value = e.currentTarget.value.replace(/[^0-9]/g, '');
                                                e.currentTarget.value = value;
                                            }}
                                            placeholder="Gastos Mensuales (Gs.)"
                                            className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[var(--color-green)] outline-none"
                                            onChange={(e) => setFormData({ ...formData, gastos: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between pt-8 border-t">
                                    <button onClick={() => setStep(1)} className="text-slate-400 font-bold hover:text-slate-600 transition-colors">← Volver</button>
                                    <button
                                        onClick={enviarSolicitud}
                                        className="bg-[var(--color-green)] text-white px-12 py-4 rounded-xl font-bold shadow-xl hover:brightness-110 active:scale-95 transition-all"
                                    >
                                        Confirmar y Enviar Solicitud
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
}
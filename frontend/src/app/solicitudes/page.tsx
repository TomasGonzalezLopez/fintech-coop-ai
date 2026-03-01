"use client";

import { useState } from "react";
import {
    Camera, Check, ChevronRight, Loader2, MapPin,
    Upload, FileText, Navigation, PartyPopper, ArrowLeft
} from "lucide-react";
import { useSolicitudForm } from "./hooks/solicitudForm";

export default function SolicitudesPage() {
    const {
        step,
        setStep,
        isProcessing,
        locating,
        image,
        formData,
        setFormData,
        handleImageUpload,
        handleGetLocation,
        handleFinalSubmit
    } = useSolicitudForm();

    return (
        <div className="max-w-4xl mx-auto p-4 transition-all">
            <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl flex flex-col min-h-[600px]">

                {step < 4 && (
                    <div className="flex items-center gap-4 mb-10">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className="flex flex-1 items-center gap-2">
                                <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= num ? "bg-[#004d40] text-white shadow-lg shadow-green-900/20" : "bg-slate-100 text-slate-400"}`}>
                                    {step > num ? <Check className="w-5 h-5" /> : num}
                                </span>
                                <div className="flex-1 h-[3px] bg-slate-100 relative rounded-full overflow-hidden">
                                    <div className={`absolute h-full bg-[#004d40] transition-all duration-700 ${step > num ? "w-full" : "w-0"}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {isProcessing ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-6 animate-pulse">
                        <div className="relative">
                            <Loader2 className="w-16 h-16 text-[#004d40] animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 bg-[#004d40]/10 rounded-full" />
                            </div>
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-slate-700">Procesando solicitud...</h2>
                            <p className="text-slate-400">Nuestra IA está verificando tus datos</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {step === 1 && (
                            <div className="flex-1 flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in-95">
                                <div className="text-center">
                                    <h1 className="text-3xl font-bold text-slate-800">Identidad</h1>
                                    <p className="text-slate-500 mt-2">Sube una foto clara del frente de tu cédula</p>
                                </div>
                                <div className="w-full max-w-md border-2 border-dashed border-slate-200 rounded-3xl p-12 bg-slate-50 hover:border-[#004d40] transition-all relative group cursor-pointer text-center">
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Camera className="w-8 h-8 text-[#004d40]" />
                                    </div>
                                    <p className="text-lg font-semibold text-slate-700">Seleccionar Foto</p>
                                    <p className="text-xs text-slate-400 mt-2">JPG o PNG (Máx 5MB)</p>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-2xl border border-green-100">
                                    <Check className="w-5 h-5" />
                                    <p className="text-sm font-medium">¡Datos extraídos con éxito! Verifica si son correctos.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Nombre Completo</label>
                                            <input value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full mt-1 p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#004d40] outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Número de Cédula</label>
                                            <input value={formData.cedula} onChange={(e) => setFormData({ ...formData, cedula: e.target.value })} className="w-full mt-1 p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#004d40] outline-none" />
                                        </div>
                                    </div>
                                    <div className="rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm relative group">
                                        <img src={image!} alt="Cédula" className="w-full h-full object-cover" />
                                        <button onClick={() => setStep(1)} className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-slate-600 hover:bg-white">Reintentar</button>
                                    </div>
                                </div>
                                <button onClick={() => setStep(3)} className="w-full bg-[#004d40] text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-xl transition-all">
                                    Es correcto, continuar <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="flex items-center justify-between border-b pb-4 border-slate-100">
                                    <h2 className="text-xl font-bold text-slate-800">Domicilio y Residencia</h2>
                                    <button onClick={handleGetLocation} disabled={locating} className="flex items-center gap-2 text-sm font-bold text-[#004d40] hover:bg-green-50 px-4 py-2 rounded-xl transition-all">
                                        {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                                        {locating ? "Ubicando..." : "GPS"}
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Ciudad</label>
                                        <select className="w-full mt-1 p-4 bg-slate-50 rounded-2xl border border-slate-200 outline-none">
                                            <option>Asunción</option>
                                            <option>Lambaré</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Barrio</label>
                                        <input value={formData.barrio} onChange={(e) => setFormData({ ...formData, barrio: e.target.value })} className="w-full mt-1 p-4 bg-slate-50 rounded-2xl border border-slate-200 outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Dirección Detallada</label>
                                    <textarea value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} placeholder="Ej: San Vicente, calle c/ Avda..." className="w-full mt-1 p-4 bg-slate-50 rounded-2xl border border-slate-200 outline-none h-24" />
                                </div>
                                <div className="border-2 border-dashed border-slate-100 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-slate-500">Subir Comprobante (Factura ANDE/ESSAP)</p>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setStep(2)} className="flex-1 py-4 text-slate-400 font-bold hover:bg-slate-50 rounded-2xl transition-all">Atrás</button>
                                    <button onClick={handleFinalSubmit} className="flex-[2] bg-[#004d40] text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-[#00332c] transition-all">
                                        Enviar Solicitud
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-90 duration-500">
                                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shadow-inner">
                                    <PartyPopper className="w-12 h-12 text-[#004d40]" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-black text-slate-800">¡Solicitud Enviada!</h1>
                                    <p className="text-slate-500 text-lg mt-2 max-w-sm">
                                        Gracias, **{formData.nombre.split(' ')[0]}**. Tu solicitud ha sido recibida y está siendo analizada por nuestro sistema.
                                    </p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-left w-full max-w-md">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Estado de IA</p>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Nuestro **Cooperativa AI Architect** está validando tu vinculación con el barrio **{formData.barrio}**. Recibirás una notificación en menos de 24 horas.
                                    </p>
                                </div>
                                <button onClick={() => window.location.reload()} className="flex items-center gap-2 text-[#004d40] font-bold hover:underline transition-all">
                                    <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
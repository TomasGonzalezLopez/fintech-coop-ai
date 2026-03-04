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
        <div className="max-w-4xl mx-auto p-6 pt-10 transition-all">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl flex flex-col">

                {step < 4 && (
                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-slate-800 mb-1">Solicitud de Socio</h2>
                        <p className="text-[#004d40] font-bold text-lg mb-6">Paso {step}</p>
                        <div className="flex items-center gap-4 max-w-2xl">
                            {[1, 2, 3].map((num) => (
                                <div key={num} className="flex flex-1 items-center gap-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${step >= num ? "bg-[#004d40] text-white shadow-lg shadow-green-900/20" : "bg-slate-100 text-slate-400"}`}>
                                        {step > num ? <Check className="w-5 h-5" /> : num}
                                    </div>
                                    {num < 3 && (
                                        <div className="flex-1 h-[3px] bg-slate-100 relative rounded-full overflow-hidden">
                                            <div className={`absolute h-full bg-[#004d40] transition-all duration-700 ${step > num ? "w-full" : "w-0"}`} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {isProcessing ? (
                    <div className="py-20 flex flex-col items-center justify-center space-y-6 animate-pulse">
                        <div className="relative">
                            <Loader2 className="w-16 h-16 text-[#004d40] animate-spin" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-slate-700">Procesando solicitud...</h2>
                            <p className="text-slate-400">Nuestra IA está verificando tus datos</p>
                        </div>
                    </div>
                ) : (
                    <div className="mt-4">
                        {step === 1 && (
                            <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-800">Identidad</h1>
                                    <p className="text-slate-500">Sube una foto clara del frente de tu cédula para extraccion de datos.</p>
                                </div>

                                <div className="w-full border-2 border-dashed border-slate-200 rounded-[2rem] p-16 bg-slate-50 hover:border-[#004d40] hover:bg-green-50/30 transition-all relative group cursor-pointer text-center">
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                                    <div className="bg-white w-20 h-20 rounded-2xl shadow-md flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                        <Camera className="w-10 h-10 text-[#004d40]" />
                                    </div>
                                    <p className="text-xl font-bold text-slate-700">Seleccionar Foto de Cédula</p>
                                    <p className="text-sm text-slate-400 mt-2">Formatos aceptados: JPG o PNG</p>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-500">
                                <div className="flex items-center gap-3 p-5 bg-green-50 text-green-700 rounded-2xl border border-green-100">
                                    <div className="bg-green-500 text-white p-1 rounded-full">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    <p className="font-semibold">¡Datos extraídos con éxito!</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <div className="group">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                                            <input
                                                value={formData.nombre}
                                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                                className="w-full mt-2 p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#004d40] focus:bg-white outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Número de Cédula</label>
                                            <input
                                                value={formData.cedula}
                                                onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                                                className="w-full mt-2 p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#004d40] focus:bg-white outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="rounded-[2rem] overflow-hidden border-4 border-white shadow-xl relative group h-[240px]">
                                        <img src={image!} alt="Cédula" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
                                        <button onClick={() => setStep(1)} className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-xl text-sm font-bold text-slate-700 shadow-lg hover:scale-105 transition-all">Reintentar</button>
                                    </div>
                                </div>
                                <button onClick={() => setStep(3)} className="w-full bg-[#004d40] text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:shadow-2xl hover:brightness-110 active:scale-[0.98] transition-all">
                                    Confirmar datos y continuar <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-500">
                                <div className="flex items-center justify-between border-b pb-4 border-slate-100">
                                    <h2 className="text-2xl font-bold text-slate-800">Domicilio</h2>
                                    <button
                                        onClick={handleGetLocation}
                                        disabled={locating}
                                        className="flex items-center gap-2 text-sm font-black text-[#004d40] bg-green-50 hover:bg-green-100 px-5 py-2.5 rounded-2xl transition-all active:scale-95"
                                    >
                                        {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                                        {locating ? "Ubicando..." : "USAR MI UBICACIÓN (GPS)"}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Ciudad</label>
                                        <select className="w-full mt-2 p-4 bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#004d40]">
                                            <option>Asunción</option>
                                            <option>Lambaré</option>
                                            <option>Fernando de la Mora</option>
                                            <option>San Lorenzo</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Barrio</label>
                                        <input
                                            value={formData.barrio}
                                            onChange={(e) => setFormData({ ...formData, barrio: e.target.value })}
                                            className="w-full mt-2 p-4 bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#004d40]"
                                            placeholder="Nombre del barrio"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Dirección Detallada</label>
                                    <textarea
                                        value={formData.direccion}
                                        onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                                        placeholder="Ej: Calle San Vicente casi Avda. Próceres..."
                                        className="w-full mt-2 p-4 bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#004d40] h-32 resize-none"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button onClick={() => setStep(2)} className="flex-1 py-4 text-slate-400 font-bold hover:bg-slate-50 rounded-2xl transition-all">Atrás</button>
                                    <button onClick={handleFinalSubmit} className="flex-[3] bg-[#004d40] text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:bg-[#00332c] active:scale-[0.98] transition-all">
                                        Enviar Solicitud
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="py-10 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in-95 duration-700">
                                <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center shadow-inner">
                                    <PartyPopper className="w-14 h-14 text-[#004d40]" />
                                </div>
                                <div className="max-w-md">
                                    <h1 className="text-4xl font-black text-slate-800">¡Listo!</h1>
                                    <p className="text-slate-500 text-lg mt-4 leading-relaxed">
                                        Hemos recibido tu solicitud, **{formData.nombre?.split(' ')[0]}**. En breve un asesor se pondrá en contacto contigo.
                                    </p>
                                </div>
                                <button onClick={() => window.location.reload()} className="flex items-center gap-2 text-[#004d40] font-black hover:underline text-lg decoration-2 underline-offset-4">
                                    <ArrowLeft className="w-5 h-5" /> Regresar al Inicio
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
import { useState } from "react";
import { extractCedulaData } from "@/components/utils/ocrService";
export const useSolicitudForm = () => {
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [locating, setLocating] = useState(false);
    const [image, setImage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        nombre: "",
        cedula: "",
        ciudad: "Asunción",
        barrio: "San Vicente",
        direccion: "",
        ingresos: "",
        gastos: "",
        montoSolicitado: "",
        plazoSolicitado: "12",
        tipoCredito: "Consumo"
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result as string);
        };
        reader.readAsDataURL(file);

        try {
            const data = await extractCedulaData(file);
            setFormData(prev => ({
                ...prev,
                nombre: data.nombre || "No detectado",
                cedula: data.cedula || "No detectado"
            }));

            setStep(2);

        } catch (error) {
            console.error("Fallo la extracción:", error);
            alert("Hubo un problema procesando la cédula. Por favor, intenta con una foto más clara.");
        } finally {
            setIsProcessing(false);
        }
    };


    const handleGetLocation = () => {
        setLocating(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setTimeout(() => {
                        setFormData({
                            ...formData,
                            direccion: `Coordenadas: ${latitude.toFixed(4)}, ${longitude.toFixed(4)} - Cerca de San Vicente, Asunción`
                        });
                        setLocating(false);
                    }, 1500);
                },
                () => {
                    setLocating(false);
                    alert("No pudimos obtener tu ubicación.");
                }
            );
        }
    };

    const handleFinalSubmit = async () => {
        setIsProcessing(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/socios/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: formData.nombre.split(' ')[0],
                    apellido: formData.nombre.split(' ').slice(1).join(' '),
                    cedula: formData.cedula,
                    ciudad: formData.ciudad,
                    direccion: formData.direccion,
                    telefono: "0981XXXXXX",
                    barrio: formData.barrio
                }),
            });

            if (response.ok) {
                setStep(4);
            } else {
                alert("Error al guardar la solicitud en la base de datos");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    return {
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
    };
};
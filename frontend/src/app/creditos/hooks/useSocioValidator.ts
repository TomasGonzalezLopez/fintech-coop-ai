import { useState } from "react";

export const useSocioVerificador = (setFormData: any) => {
    const [cedulaInput, setCedulaInput] = useState("");
    const [isCheckingDB, setIsCheckingDB] = useState(false);
    const [socioNotFound, setSocioNotFound] = useState(false);

    const verificarSocio = async () => {
        if (!cedulaInput) return;
        setIsCheckingDB(true);
        setSocioNotFound(false);

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/v1/socios/?cedula=${cedulaInput}`);
            const data = await response.json();
            const resultados = Array.isArray(data) ? data : (data.results || []);

            if (resultados.length > 0) {
                const socio = resultados[0];
                setFormData((prev: any) => ({
                    ...prev,
                    nombre: `${socio.nombre} ${socio.apellido}`,
                    cedula: socio.cedula
                }));
            } else {
                setSocioNotFound(true);
            }
        } catch (error) {
            alert("Error al conectar con el servidor.");
        } finally {
            setIsCheckingDB(false);
        }
    };

    return { cedulaInput, setCedulaInput, isCheckingDB, socioNotFound, verificarSocio };
};
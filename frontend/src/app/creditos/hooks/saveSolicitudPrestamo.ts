import { API_BASE_URL } from "@/lib/api";

export const useSolicitudActions = () => {

    const guardarEnBaseDeDatos = async (todoElEstado: any) => {
        const { formData, socio } = todoElEstado;

        const limpiarNumero = (valor: any) => {
            if (!valor) return 0;
            return String(valor).replace(/\D/g, "");
        };


        const montoNum = Number(limpiarNumero(formData.montoSolicitado));
        const plazoNum = Number(formData.plazoSolicitado) || 12;
        const cuotaEstimada = Math.round(montoNum / plazoNum);

        const payload = {
            cedula: socio.cedulaInput || formData.cedula || "Sin Cedula",
            nombre: formData.nombre || "Sin Nombre",
            monto: montoNum,
            plazo: plazoNum,
            cuota: cuotaEstimada,
            ingresos: limpiarNumero(formData.ingresos),
            gastos: limpiarNumero(formData.gastos),
            tipo_credito: formData.tipoCredito || "Consumo",
            estado: "Pendiente"
        };

        console.log("Enviando este payload a Django:", payload);

        try {
            const response = await fetch(`${API_BASE_URL}/api/solicitud-prestamo/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                return true;
            } else {
                const errorData = await response.json();
                console.error("Errores de Django:", errorData);
                alert("Error: " + JSON.stringify(errorData));
                return false;
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión con el servidor");
            return false;
        }
    };

    return { guardarEnBaseDeDatos };
};
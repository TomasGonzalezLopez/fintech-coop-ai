export const useSolicitudActions = () => {

    const guardarEnBaseDeDatos = async (todoElEstado: any) => {
        const { formData, socio } = todoElEstado; // Ya no dependemos obligatoriamente de 'calc'

        const limpiarNumero = (valor: any) => {
            if (!valor) return 0;
            return String(valor).replace(/\D/g, "");
        };

        // Calculamos una cuota estimativa simple para que Django no reciba null
        const montoNum = Number(limpiarNumero(formData.montoSolicitado));
        const plazoNum = Number(formData.plazoSolicitado) || 12;
        const cuotaEstimada = Math.round(montoNum / plazoNum);

        const payload = {
            cedula: socio.cedulaInput || formData.cedula || "Sin Cedula",
            nombre: formData.nombre || "Sin Nombre",
            // Ahora sacamos los datos directamente del formData del formulario
            monto: montoNum,
            plazo: plazoNum,
            cuota: cuotaEstimada,
            ingresos: limpiarNumero(formData.ingresos),
            gastos: limpiarNumero(formData.gastos),
            // Si no seleccionó tipo, enviamos uno genérico para evitar el error de 20 caracteres
            tipo_credito: formData.tipoCredito || "Consumo",
            estado: "Pendiente"
        };

        console.log("Enviando este payload a Django:", payload);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/solicitud-prestamo/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                return true;
            } else {
                const errorData = await response.json();
                console.error("Errores de Django:", errorData);
                alert("❌ Error: " + JSON.stringify(errorData));
                return false;
            }
        } catch (error) {
            console.error(error);
            alert("❌ Error de conexión con el servidor");
            return false;
        }
    };

    return { guardarEnBaseDeDatos };
};
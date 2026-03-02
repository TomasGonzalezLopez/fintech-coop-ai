
export const extractCedulaData = async (file: File) => {
    const payload = new FormData();
    payload.append("cedula_image", file);

    const response = await fetch("http://127.0.0.1:8000/api/ocr-cedula/", {
        method: "POST",
        body: payload,
    });

    if (!response.ok) {
        throw new Error("Error en la extracción de OCR con el servidor");
    }

    return await response.json();
};
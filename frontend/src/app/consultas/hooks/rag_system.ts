import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api";

export const useRAGSystem = () => {
    const [query, setQuery] = useState("");
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hola. Soy un asistente de IA especializado en análisis de documentos bancarios y contractuales. Estoy listo para ayudarte con cualquier consulta que tengas sobre los documentos proporcionados."
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        const savedChat = localStorage.getItem("gnb_chat_history");
        if (savedChat) {
            try {
                setMessages(JSON.parse(savedChat));
            } catch (error) {
                console.error("Error leyendo el historial", error);
            }
        }
    }, []);

    useEffect(() => {
        if (messages.length > 1) {
            localStorage.setItem("gnb_chat_history", JSON.stringify(messages));
        }
    }, [messages]);

    const handleClearChat = () => {
        setMessages([
            {
                role: "assistant",
                content: "Hola. Soy un asistente de IA especializado en análisis de documentos bancarios y contractuales. Estoy listo para ayudarte con cualquier consulta que tengas sobre los documentos proporcionados."
            }
        ]);
        localStorage.removeItem("gnb_chat_history");
    };

    const handleSendMessage = async () => {
        if (!query.trim()) return;

        const userMessage = { role: "user", content: query };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setQuery("");
        setIsTyping(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/chat/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question: query }),
            });

            if (!response.ok) {
                throw new Error("Error en la conexión con el servidor");
            }

            const data = await response.json();

            setMessages([
                ...newMessages,
                {
                    role: "assistant",
                    content: data.answer,
                },
            ]);
        } catch (error) {
            setMessages([
                ...newMessages,
                {
                    role: "assistant",
                    content: "Lo siento, hubo un error al conectar con el servidor de IA. Verifica que el backend esté corriendo.",
                },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    return {
        query,
        setQuery,
        messages,
        isTyping,
        handleSendMessage,
        handleClearChat
    };
};
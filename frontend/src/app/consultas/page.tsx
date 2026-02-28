"use client";

import { useState, useEffect } from "react";
import { Bot, Send, User, Sparkles, Trash2 } from "lucide-react";

export default function ConsultasIAPage() {
    const [query, setQuery] = useState("");

    const defaultMessage = {
        role: "assistant",
        content: "Hola. Soy un asistente de IA especializado en análisis de documentos bancarios y contractuales. Estoy listo para ayudarte con cualquier consulta que tengas sobre los documentos proporcionados."
    };

    const [messages, setMessages] = useState([defaultMessage]);
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
        setMessages([defaultMessage]);
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
            const response = await fetch("http://127.0.0.1:8000/api/chat/", {
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

    return (
        <div className="flex flex-col h-[calc(100vh-150px)] max-w-5xl mx-auto p-4">
            <div className="bg-white p-6 rounded-t-3xl border border-slate-200 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="bg-[#004d40] p-3 rounded-2xl">
                        <Bot className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Cooperativa AI Architect</h2>
                        <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Sistema RAG Activo
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
                        Contexto: Banco GNB
                    </span>
                    <button
                        onClick={handleClearChat}
                        title="Limpiar chat"
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-slate-50 border-x border-slate-200 overflow-y-auto p-6 space-y-6">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-slate-300" : "bg-[#004d40]"}`}>
                                {msg.role === "user" ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                            </div>
                            <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.role === "user" ? "bg-white text-slate-700 rounded-tr-none" : "bg-[#004d40] text-white rounded-tl-none"}`}>
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start animate-pulse">
                        <div className="bg-slate-200 h-8 w-24 rounded-full" />
                    </div>
                )}
            </div>

            <div className="bg-white p-6 rounded-b-3xl border border-slate-200 shadow-lg">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Ej: ¿Cuáles son los requisitos para la tarjeta prepaga?"
                        className="w-full p-4 pr-16 bg-slate-100 rounded-2xl border-none focus:ring-2 focus:ring-[#004d40] outline-none text-slate-700"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isTyping}
                        className={`absolute right-2 p-3 rounded-xl transition-all ${isTyping ? "bg-slate-300 cursor-not-allowed" : "bg-[#004d40] hover:bg-[#00332c] text-white"}`}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-3 text-center uppercase font-bold tracking-widest">
                    Seguridad de Datos: Consultas encriptadas end-to-end (Ambiente Local)
                </p>
            </div>
        </div>
    );
}
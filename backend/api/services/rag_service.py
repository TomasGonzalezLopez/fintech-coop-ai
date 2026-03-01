import os
import numpy as np
from typing import List, Dict, Optional

from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from sentence_transformers import CrossEncoder


class CooperativaAdvancedRAG:
    def __init__(self):
       
        current_dir = os.path.dirname(os.path.abspath(__file__))
        api_dir = os.path.dirname(current_dir) 
        backend_dir = os.path.dirname(api_dir)

        
        env_path = os.path.join(backend_dir, ".env")
        load_dotenv(env_path)

        self.persist_directory = os.path.join(backend_dir, "faiss_index")

        if not os.path.exists(self.persist_directory):
            raise RuntimeError(
                "faiss index does not exist"
            )

        self.embeddings = HuggingFaceEmbeddings(
            model_name="paraphrase-multilingual-MiniLM-L12-v2"
        )

        self.db = FAISS.load_local(
            self.persist_directory,
            self.embeddings,
            allow_dangerous_deserialization=True,
        )

        self.cross_encoder = CrossEncoder(
            "cross-encoder/mmarco-mMiniLMv2-L12-H384-v1"
        )

        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0.1,
        )

    def query(
        self,
        question: str,
        chat_history: Optional[List[Dict[str, str]]] = None,
        top_k_initial: int = 15,
        top_k_final: int = 3,
    ) -> str:
       
        history_text = ""

        if chat_history:
            for turn in chat_history[-3:]:
                history_text += f"Usuario: {turn.get('user','')}\n"
                history_text += f"Asistente: {turn.get('assistant','')}\n"

        standalone_question = question

        if history_text:
            rewrite_prompt = f"""
            Reformula la pregunta para que sea completamente independiente y clara.

            Historial:
            {history_text}

            Pregunta actual:
            {question}

            Pregunta reformulada:
            """
            rewritten = self.llm.invoke(rewrite_prompt).content.strip()

            if rewritten:
                standalone_question = rewritten

        initial_docs = self.db.similarity_search(
            standalone_question,
            k=top_k_initial
        )

        if not initial_docs:
            return "No encontré información relevante en los documentos disponibles."

        cross_inputs = [
            [standalone_question, doc.page_content]
            for doc in initial_docs
        ]

        scores = self.cross_encoder.predict(cross_inputs)

        sorted_idx = np.argsort(scores)[::-1]
        top_docs = [initial_docs[i] for i in sorted_idx[:top_k_final]]

        MAX_CHARS = 4000
        context_parts = []
        current_size = 0

        for i, doc in enumerate(top_docs):
            text = doc.page_content.strip()
            if current_size + len(text) > MAX_CHARS:
                break
            context_parts.append(f"Documento {i+1}:\n{text}")
            current_size += len(text)

        context = "\n\n".join(context_parts)

        prompt = f"""
            Eres un asistente especializado en análisis de documentos bancarios y contractuales.

            INSTRUCCIONES:
            - Usa el historial solo para entender referencias.
            - Responde ÚNICAMENTE usando la información del CONTEXTO.
            - No inventes datos.
            - Si la pregunta es ambigua, solicita aclaración.
            - Si la información no está en el contexto, responde:
            "No tengo suficiente información en los documentos disponibles para responder a esta consulta."
            - Cuando sea posible, indica el número del documento utilizado.

            HISTORIAL:
            {history_text}

            CONTEXTO:
            {context}

            PREGUNTA:
            {question}

            RESPUESTA:
            """

        response = self.llm.invoke(prompt)
        return response.content


if __name__ == "__main__":

    rag = CooperativaConversationalRAG()

    chat_history = []

    while True:
        user_input = input("\nUsuario: ")

        if user_input.lower() in ["exit", "salir"]:
            break

        answer = rag.query(user_input, chat_history)

        print("\nAsistente:", answer)

        chat_history.append({
            "user": user_input,
            "assistant": answer
        })
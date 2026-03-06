import os
import numpy as np
from typing import List, Dict, Optional

from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_huggingface import HuggingFaceEndpoint
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
            raise RuntimeError("faiss index does not exist")

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

        self.llm = HuggingFaceEndpoint(
            repo_id="mistralai/Mistral-7B-Instruct-v0.3",
            task="text-generation",
            max_new_tokens=512,
            temperature=0.1,
            huggingfacehub_api_token=os.getenv("HUGGINGFACEHUB_API_TOKEN"),
            return_full_text=False 
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
            for turn in chat_history[-5:]:
                role = "Usuario" if turn.get('role') == 'user' else "Asistente"
                content = turn.get('content', '')
                history_text += f"{role}: {content}\n"

        standalone_question = question

        if history_text:
            rewrite_prompt = f"<s>[INST] Basándote en el historial, reformula la pregunta actual para que sea una pregunta independiente en una sola línea.\nHistorial:\n{history_text}\nPregunta: {question} [/INST]</s>"
    
            try:
                rewritten = self.llm.invoke(rewrite_prompt).strip() 
                if rewritten:
                    standalone_question = rewritten
            except Exception as e:
                print(f"Error rewriting: {e}")

        initial_docs = self.db.similarity_search(standalone_question, k=top_k_initial)

        if not initial_docs:
            return "No encontré información relevante."

        cross_inputs = [[standalone_question, doc.page_content] for doc in initial_docs]
        scores = self.cross_encoder.predict(cross_inputs)
        sorted_idx = np.argsort(scores)[::-1]
        top_docs = [initial_docs[i] for i in sorted_idx[:top_k_final]]

        context = "\n\n".join([f"Documento {i+1}:\n{d.page_content}" for i, d in enumerate(top_docs)])

        prompt = f"""<s>[INST] Eres un asistente experto en análisis de documentos bancarios y contractuales de la Cooperativa.

            INSTRUCCIONES:
            - Usa el HISTORIAL solo para entender referencias o pronombres (ej: "él", "eso", "dicho documento").
            - Responde ÚNICAMENTE usando la información del CONTEXTO. No uses conocimientos externos.
            - No inventes datos. Si la información no está, responde exactamente: "No tengo suficiente información en los documentos disponibles para responder a esta consulta."
            - Indica el número del documento utilizado (ej: "Según el Documento 1...").

            HISTORIAL DE CONVERSACIÓN:
            {history_text}

            CONTEXTO TÉCNICO:
            {context}

            PREGUNTA DEL USUARIO:
            {question} [/INST] 
            RESPUESTA: """
        
        response = self.llm.invoke(prompt)
        return response.content
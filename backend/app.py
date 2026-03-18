from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

app = Flask(__name__)
CORS(app)

DB_PATH = "knowledge.db"

def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_conn() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS artigos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                pergunta TEXT NOT NULL,
                resposta TEXT NOT NULL,
                categoria TEXT DEFAULT 'Geral',
                status TEXT DEFAULT 'pendente',
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()

init_db()

@app.route("/buscar", methods=["GET"])
def buscar():
    query = request.args.get("q", "").lower()
    with get_conn() as conn:
        artigos = conn.execute("SELECT * FROM artigos").fetchall()
    
    resultados = []
    for artigo in artigos:
        if any(palavra in artigo["pergunta"].lower() for palavra in query.split()):
            resultados.append({
                "id": artigo["id"],
                "pergunta": artigo["pergunta"],
                "resposta": artigo["resposta"]
            })
    
    return jsonify(resultados)

@app.route("/artigos", methods=["GET", "POST"])
def artigos():
    if request.method == "POST":
        dados = request.json
        with get_conn() as conn:
            conn.execute(
                "INSERT INTO artigos (pergunta, resposta, categoria, status) VALUES (?, ?, ?, ?)",
                (dados["pergunta"], dados["resposta"], dados.get("categoria", "Geral"), "pendente")
            )
            conn.commit()
        return jsonify({"ok": True})
    
    else:
        with get_conn() as conn:
            todos = conn.execute(
                "SELECT * FROM artigos WHERE status = 'oficial' ORDER BY criado_em DESC"
            ).fetchall()
        return jsonify([{
            "id": artigo["id"],
            "pergunta": artigo["pergunta"],
            "resposta": artigo["resposta"],
            "categoria": artigo["categoria"],
            "criado_em": artigo["criado_em"]
        } for artigo in todos])

@app.route("/revisao", methods=["GET"])
def revisao():
    with get_conn() as conn:
        pendentes = conn.execute(
            "SELECT * FROM artigos WHERE status = 'pendente' ORDER BY criado_em DESC"
        ).fetchall()
    return jsonify([{
        "id": artigo["id"],
        "pergunta": artigo["pergunta"],
        "resposta": artigo["resposta"],
        "categoria": artigo["categoria"],
        "criado_em": artigo["criado_em"]
    } for artigo in pendentes])

@app.route("/artigos/<int:id>/aprovar", methods=["POST"])
def aprovar(id):
    dados = request.json
    with get_conn() as conn:
        conn.execute(
            "UPDATE artigos SET status = 'oficial', resposta = ?, categoria = ? WHERE id = ?",
            (dados["resposta"], dados["categoria"], id)
        )
        conn.commit()
    return jsonify({"ok": True})

@app.route("/responder", methods=["POST"])
def responder():
    dados = request.json
    mensagem = dados["mensagem"]

    # 1. Busca na base de conhecimento
    with get_conn() as conn:
        artigos = conn.execute("SELECT * FROM artigos WHERE status = 'oficial'").fetchall()
    
    contexto = ""
    relevantes = [a for a in artigos if any(p in a["pergunta"].lower() for p in mensagem.lower().split())]
    
    if relevantes:
        contexto = "Artigos encontrados na base de conhecimento:\n" + \
            "\n\n".join([f"Pergunta: {a['pergunta']}\nResposta: {a['resposta']}" for a in relevantes])

    # 2. Chama o Gemini
    prompt = f"""Você é o Theo, uma calopsita calminha, manhosa e com jeito tranquilo de ser. 
Você responde perguntas sobre cuidados com aves de forma clara e útil, mas sempre com sua personalidade serena e gentil.
Você pode fazer uma observação de vez em quando no seu estilo calmo — um bocejo discreto, uma pausinha — mas nunca deixa isso atrapalhar a resposta.
A resposta sempre precisa ser completa e útil pra quem tem uma ave em casa.
Responda de forma acessível, como se estivesse conversando com um amigo. Seja conciso — respostas de no máximo 4 parágrafos curtos.

{f'Use esses artigos como referência se forem relevantes:{contexto}' if contexto else ''}

Dúvida do usuário: {mensagem}"""

    result = model.generate_content(prompt)
    resposta = result.text

    # 3. Se não tinha artigo relevante, salva como pendente
    if not relevantes:
        with get_conn() as conn:
            conn.execute(
                "INSERT INTO artigos (pergunta, resposta, status) VALUES (?, ?, ?)",
                (mensagem, resposta, "pendente")
            )
            conn.commit()

    return jsonify({"resposta": resposta})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
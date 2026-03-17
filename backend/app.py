 
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

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

@app.route("/artigos", methods=["POST"])
def criar_artigo():
    dados = request.json
    with get_conn() as conn:
        conn.execute(
            "INSERT INTO artigos (pergunta, resposta) VALUES (?, ?)",
            (dados["pergunta"], dados["resposta"])
        )
        conn.commit()
    return jsonify({"ok": True})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
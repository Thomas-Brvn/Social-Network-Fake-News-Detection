from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_community.tools import DuckDuckGoSearchRun
from langgraph.prebuilt import create_react_agent
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage
import os

os.environ["TOKENIZERS_PARALLELISM"] = "false"

app = FastAPI()

# CORS : autoriser tout (en dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialise LLM Ollama
llm = ChatOllama(model="llama3.2")

# Outil de recherche web DuckDuckGo (outil LangChain)
duckduckgo_search = DuckDuckGoSearchRun()

# Prompt personnalisé (contexte)
prompt_context = """
Tu es un assistant intelligent spécialisé dans la détection de fausses informations (fake news).
Tu dois utiliser la recherche web pour vérifier les affirmations douteuses.
Réponds en français de manière claire, concise, et structurée.
Ne parle pas de ta reponse précédente, concentre-toi sur la vérification de la nouvelle information.
Ne t'excuse pas pour des erreurs, donne directement ta réponse.
"""

# Création de l'agent React avec LLM, outil et prompt
web_search_agent = create_react_agent(
    llm,
    tools=[duckduckgo_search],
    prompt=prompt_context
)

# Modèle Pydantic pour requête POST
class PostRequest(BaseModel):
    post_text: str

# Route POST pour analyser un texte
@app.post("/check_fake_news")
async def check_fake_news(req: PostRequest):
    query = f"Est-ce que ce post est une fake news : \"{req.post_text}\" ?"
    result = web_search_agent.invoke({"messages": [HumanMessage(content=query)]})
    return {"analysis": result["messages"][-1].content}


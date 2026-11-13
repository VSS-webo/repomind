
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl

from app.services.repository_manager import RepositoryManager
from app.services.analysis_service import AnalysisService
from app.services.impact_service import ImpactService
from app.services.search_service import SearchService
from app.services.rag_service import RAGService

from fastapi.middleware.cors import CORSMiddleware
from app.services.review_service import review_code

app = FastAPI(
    title="RepoMind AI",
    description="AI-powered codebase intelligence and impact analysis",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AskRequest(BaseModel):
    question: str
    top_k: int = 6




class RepositoryRequest(BaseModel):
    url: HttpUrl

class ReviewRequest(BaseModel):
    diff: str
    repo_id: str | None = None


@app.get("/")
def root():
    return {
        "message": "Welcome to RepoMind AI",
        "status": "running",
        "version": "0.1.0",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/api/repositories", status_code=201)
def add_repository(request: RepositoryRequest):

    url = str(request.url)

    try:
        result = RepositoryManager.clone_repository(url)

        return {
            "message": "Repository cloned successfully",
            **result,
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Repository cloning failed: {str(e)}",
        )


@app.get("/api/repositories/{repo_id}")
def get_repository(repo_id: str):

    try:
        path = RepositoryManager.get_repository_path(repo_id)

        from git import Repo

        repo = Repo(path)

        return {
            "repo_id": repo_id,
            "path": str(path),
            "branch": repo.active_branch.name,
            "commit": repo.head.commit.hexsha,
            "commit_message": repo.head.commit.message.strip(),
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/repositories/{repo_id}")
def delete_repository(repo_id: str):

    try:
        return RepositoryManager.delete_repository(repo_id)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.post("/api/repositories/{repo_id}/analyze")
def analyze_repository(repo_id: str):

    try:
        return AnalysisService.analyze_repository(repo_id)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/repositories/{repo_id}/graph")
def get_repository_graph(repo_id: str):

    try:
        result = AnalysisService.analyze_repository(repo_id)

        return result["graph"]

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.get("/api/repositories/{repo_id}/impact/{entity_id:path}")
def analyze_impact(repo_id: str, entity_id: str):
    try:
        return ImpactService.analyze_impact(
            repo_id,
            entity_id
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.post("/api/repositories/{repo_id}/index")
def index_repository(repo_id: str):
    try:
        return SearchService.index_repository(repo_id)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.get("/api/repositories/{repo_id}/search")
def semantic_search(repo_id: str, q: str, top_k: int = 5):
    try:
        return SearchService.search(repo_id, q, top_k)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/repositories/{repo_id}/ask")
def ask_repository(repo_id: str, request: AskRequest):
    try:
        return RAGService.ask(
            repo_id,
            request.question,
            request.top_k
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/review")
def review_endpoint(request: ReviewRequest):
    return review_code(request.diff)
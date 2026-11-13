
from pathlib import Path

from app.parsers.python_parser import PythonParser
from app.graph.graph_builder import GraphBuilder
from app.services.repository_manager import RepositoryManager


class AnalysisService:

    IGNORE_DIRS = {
        ".git",
        "__pycache__",
        "venv",
        ".venv",
        "node_modules",
        "dist",
        "build",
    }

    @classmethod
    def analyze_repository(cls, repo_id: str):

        repo_path = RepositoryManager.get_repository_path(repo_id)

        parsed_files = []

        for file_path in repo_path.rglob("*.py"):

            if any(
                part in cls.IGNORE_DIRS
                for part in file_path.parts
            ):
                continue

            parsed = PythonParser.parse_file(
                file_path,
                repo_path,
            )

            if parsed is not None:
                parsed_files.append(parsed)

        graph = GraphBuilder.build_graph(parsed_files)

        statistics = GraphBuilder.get_statistics(graph)
        analytics = GraphBuilder.get_analytics(graph)
        return {
            "repo_id": repo_id,
            "statistics": statistics,
            "files": [
                {
                    "file": parsed["file"],
                    "entities": parsed["entities"],
                    "imports": parsed["imports"],
                    "calls": parsed["calls"],
                }
                for parsed in parsed_files
            ],
            "graph": GraphBuilder.export_graph(graph),
            "analytics": analytics,
        }

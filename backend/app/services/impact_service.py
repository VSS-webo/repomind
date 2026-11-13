
import networkx as nx

from app.services.analysis_service import AnalysisService
from app.services.repository_manager import RepositoryManager
from app.parsers.python_parser import PythonParser
from app.graph.graph_builder import GraphBuilder


class ImpactService:

    @staticmethod
    def analyze_impact(repo_id: str, entity_id: str):

        repo_path = RepositoryManager.get_repository_path(repo_id)

        parsed_files = []

        for file_path in repo_path.rglob("*.py"):
            if any(
                part in AnalysisService.IGNORE_DIRS
                for part in file_path.parts
            ):
                continue

            parsed = PythonParser.parse_file(file_path, repo_path)

            if parsed is not None:
                parsed_files.append(parsed)

        graph = GraphBuilder.build_graph(parsed_files)

        if entity_id not in graph:
            raise ValueError("Entity not found in repository graph.")

        callable_types = {
            "function", "method", "nested_function"
        }

        # Only actual call relationships.
        call_graph = nx.DiGraph()

        for node, data in graph.nodes(data=True):
            if data.get("type") in callable_types:
                call_graph.add_node(node, **data)

        for source, target, data in graph.edges(data=True):
            if (
                data.get("type") == "calls"
                and source in call_graph
                and target in call_graph
            ):
                call_graph.add_edge(source, target)

        changed = graph.nodes[entity_id]

        # If a class changes, analyze its methods.
        if changed.get("type") == "class":

            seeds = [
                node
                for node, data in graph.nodes(data=True)
                if data.get("parent") == entity_id
                and data.get("type") == "method"
            ]

        elif changed.get("type") in callable_types:
            seeds = [entity_id]

        else:
            raise ValueError(
                "Select a class, function, or method for impact analysis."
            )

        # Direct callers: actual calls into changed entities/methods.
        direct_callers = set()

        for seed in seeds:
            direct_callers.update(
                call_graph.predecessors(seed)
            )

        # Reverse call traversal for transitive impact.
        reverse_calls = call_graph.reverse(copy=True)

        impacted = set()

        for seed in seeds:
            impacted.update(
                nx.descendants(reverse_calls, seed)
            )

        impacted.difference_update(seeds)

        # Include direct callers in impacted set.
        impacted.update(direct_callers)

        impacted_entities = []

        for node in impacted:
            data = graph.nodes[node]

            impacted_entities.append({
                "id": node,
                "name": data.get("name"),
                "type": data.get("type"),
                "file": data.get("file"),
                "line": data.get("line")
            })

        impacted_entities.sort(
            key=lambda x: (x["file"], x["line"] or 0)
        )

        impacted_files = sorted({
            graph.nodes[node].get("file")
            for node in impacted
            if graph.nodes[node].get("file")
        })

        # Real call paths.
        impact_paths = []

        for caller in impacted:
            for seed in seeds:
                try:
                    path = nx.shortest_path(
                        call_graph,
                        source=caller,
                        target=seed
                    )

                    impact_paths.append(path)

                except nx.NetworkXNoPath:
                    continue

        # Explainable heuristic, not a calibrated prediction.
        complexity = max(
            [
                graph.nodes[seed].get("complexity", 1)
                for seed in seeds
            ],
            default=1
        )

        risk_score = min(
            100,
            complexity * 5 + len(impacted) * 3
        )

        return {
            "changed_entity": {
                "id": entity_id,
                "name": changed.get("name"),
                "type": changed.get("type"),
                "file": changed.get("file")
            },
            "changed_methods": seeds,
            "direct_callers": sorted(direct_callers),
            "transitive_impacted_entities": impacted_entities,
            "impacted_files": impacted_files,
            "impact_paths": impact_paths[:30],
            "risk_score": risk_score,
            "risk_level": (
                "HIGH" if risk_score >= 70
                else "MEDIUM" if risk_score >= 35
                else "LOW"
            )
        }

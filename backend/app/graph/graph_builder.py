
import networkx as nx


class GraphBuilder:

    @staticmethod
    def build_graph(parsed_files):
        graph = nx.DiGraph()

        # ---------- FILE + ENTITY NODES ----------
        entity_lookup = {}
        name_lookup = {}

        for parsed in parsed_files:
            file_path = parsed["file"]
            file_node = f"file:{file_path}"

            graph.add_node(
                file_node,
                type="file",
                name=file_path,
                file=file_path
            )

            for entity in parsed["entities"]:
                entity_id = entity["id"]

                graph.add_node(
                    entity_id,
                    **{
                        k: v for k, v in entity.items()
                        if k != "id"
                    }
                )

                graph.add_edge(file_node, entity_id, type="contains")

                entity_lookup[entity_id] = entity

                name_lookup.setdefault(entity["name"], []).append(entity_id)

        # ---------- FILE IMPORT EDGES ----------
        file_lookup = {}

        for parsed in parsed_files:
            file_path = parsed["file"]
            module_name = file_path.removesuffix(".py").replace("/", ".")

            file_lookup[module_name] = file_path

            if module_name.endswith(".__init__"):
                file_lookup[module_name.removesuffix(".__init__")] = file_path

        for parsed in parsed_files:
            source_file = parsed["file"]
            source_node = f"file:{source_file}"

            for imp in parsed["imports"]:
                module = imp["module"]
                target_file = file_lookup.get(module)

                if target_file is None:
                    for module_name, path in file_lookup.items():
                        if module.startswith(module_name + "."):
                            target_file = path
                            break

                if target_file and target_file != source_file:
                    graph.add_edge(
                        source_node,
                        f"file:{target_file}",
                        type="imports"
                    )

        # ---------- FUNCTION / METHOD CALL EDGES ----------
        for parsed in parsed_files:
            for call in parsed["calls"]:
                source_id = call.get("scope")

                if not source_id or source_id not in entity_lookup:
                    continue

                targets = name_lookup.get(call["name"], [])

                # Only resolve unambiguous calls for now
                if len(targets) == 1:
                    target_id = targets[0]

                    if source_id != target_id:
                        graph.add_edge(
                            source_id,
                            target_id,
                            type="calls"
                        )

        # ---------- INHERITANCE EDGES ----------
        for parsed in parsed_files:
            for inheritance in parsed.get("inheritance", []):
                class_id = inheritance["class"]
                base_name = inheritance["base"]

                if not base_name:
                    continue

                base_candidates = name_lookup.get(base_name, [])

                for base_id in base_candidates:
                    if entity_lookup[base_id]["type"] == "class":
                        graph.add_edge(
                            class_id,
                            base_id,
                            type="inherits"
                        )

        return graph

    @staticmethod
    def get_statistics(graph):
        node_types = [
            data.get("type")
            for _, data in graph.nodes(data=True)
        ]

        return {
            "nodes": graph.number_of_nodes(),
            "edges": graph.number_of_edges(),
            "files": node_types.count("file"),
            "functions": node_types.count("function"),
            "methods": node_types.count("method"),
            "nested_functions": node_types.count("nested_function"),
            "classes": node_types.count("class"),
        }

    @staticmethod
    def get_analytics(graph):
        function_types = {
            "function",
            "method",
            "nested_function"
        }

        function_nodes = [
            n for n, d in graph.nodes(data=True)
            if d.get("type") in function_types
        ]

        function_graph = graph.subgraph(function_nodes).copy()

        degree = dict(function_graph.degree())
        centrality = nx.degree_centrality(function_graph)

        hotspots = []

        for node, data in function_graph.nodes(data=True):
            complexity = data.get("complexity", 1)
            connections = degree.get(node, 0)

            hotspots.append({
                "id": node,
                "name": data.get("name"),
                "type": data.get("type"),
                "file": data.get("file"),
                "line": data.get("line"),
                "complexity": complexity,
                "connections": connections,
                "centrality": centrality.get(node, 0),
                "risk_score": round(
                    complexity * (1 + connections), 2
                )
            })

        hotspots.sort(
            key=lambda x: x["risk_score"],
            reverse=True
        )

        file_nodes = [
            n for n, d in graph.nodes(data=True)
            if d.get("type") == "file"
        ]

        file_graph = graph.subgraph(file_nodes).copy()

        cycles = [
            cycle for cycle in nx.simple_cycles(file_graph)
            if len(cycle) > 1
        ]

        return {
            "top_hotspots": hotspots[:15],
            "circular_dependencies": cycles[:20]
        }

    @staticmethod
    def export_graph(graph):
        return {
            "nodes": [
                {"id": node, **data}
                for node, data in graph.nodes(data=True)
            ],
            "edges": [
                {
                    "source": source,
                    "target": target,
                    **data
                }
                for source, target, data in graph.edges(data=True)
            ]
        }

    @staticmethod
    def get_analytics(graph):
        function_types = {
            "function",
            "method",
            "nested_function"
        }

        function_nodes = [
            node
            for node, data in graph.nodes(data=True)
            if data.get("type") in function_types
        ]

        function_graph = graph.subgraph(function_nodes).copy()

        degree = dict(function_graph.degree())

        centrality = nx.degree_centrality(function_graph)

        hotspots = []

        for node, data in function_graph.nodes(data=True):
            complexity = data.get("complexity", 1)
            connections = degree.get(node, 0)

            risk_score = complexity * (1 + connections)

            hotspots.append({
                "id": node,
                "name": data.get("name"),
                "file": data.get("file"),
                "line": data.get("line"),
                "complexity": complexity,
                "connections": connections,
                "centrality": centrality.get(node, 0),
                "risk_score": risk_score
            })

        hotspots.sort(
            key=lambda x: x["risk_score"],
            reverse=True
        )

        file_nodes = [
            node
            for node, data in graph.nodes(data=True)
            if data.get("type") == "file"
        ]

        file_graph = graph.subgraph(file_nodes).copy()

        circular_dependencies = [
            cycle
            for cycle in nx.simple_cycles(file_graph)
            if len(cycle) > 1
        ]

        file_degree = dict(file_graph.degree())

        connected_files = sorted(
            [
                {
                    "file": data.get("file"),
                    "connections": file_degree.get(node, 0)
                }
                for node, data in file_graph.nodes(data=True)
            ],
            key=lambda x: x["connections"],
            reverse=True
        )

        return {
            "top_hotspots": hotspots[:15],
            "circular_dependencies": circular_dependencies[:20],
            "most_connected_files": connected_files[:10]
        }

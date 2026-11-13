
import ast
from pathlib import Path


class PythonParser:

    @staticmethod
    def parse_file(file_path: Path, repo_path: Path):
        relative_path = file_path.relative_to(repo_path).as_posix()

        try:
            source = file_path.read_text(
                encoding="utf-8", errors="replace"
            )
            tree = ast.parse(source, filename=relative_path)
        except (SyntaxError, UnicodeDecodeError):
            return None

        entities = []
        imports = []
        calls = []
        inheritance = []

        scope_stack = []

        def get_name(node):
            if isinstance(node, ast.Name):
                return node.id
            if isinstance(node, ast.Attribute):
                return node.attr
            if isinstance(node, ast.Call):
                return get_name(node.func)
            return None

        class Visitor(ast.NodeVisitor):

            def visit_ClassDef(self, node):
                parent = scope_stack[-1] if scope_stack else None

                entity_id = (
                    f"{relative_path}::{node.name}::{node.lineno}"
                )

                entities.append({
                    "id": entity_id,
                    "name": node.name,
                    "type": "class",
                    "file": relative_path,
                    "line": node.lineno,
                    "end_line": node.end_lineno,
                    "parent": parent,
                    "decorators": [
                        get_name(d) for d in node.decorator_list
                    ],
                })

                for base in node.bases:
                    inheritance.append({
                        "class": entity_id,
                        "base": get_name(base),
                        "file": relative_path,
                        "line": node.lineno,
                    })

                scope_stack.append(entity_id)
                self.generic_visit(node)
                scope_stack.pop()

            def visit_FunctionDef(self, node):
                self._visit_function(node)

            visit_AsyncFunctionDef = visit_FunctionDef

            def _visit_function(self, node):
                parent = scope_stack[-1] if scope_stack else None

                if parent and any(
                    e["id"] == parent and e["type"] == "class"
                    for e in entities
                ):
                    entity_type = "method"
                elif parent:
                    entity_type = "nested_function"
                else:
                    entity_type = "function"

                entity_id = (
                    f"{relative_path}::{node.name}::{node.lineno}"
                )

                complexity = 1

                for child in ast.walk(node):
                    if isinstance(child, (
                        ast.If, ast.For, ast.AsyncFor,
                        ast.While, ast.ExceptHandler,
                        ast.IfExp, ast.Assert,
                    )):
                        complexity += 1
                    elif isinstance(child, ast.BoolOp):
                        complexity += len(child.values) - 1
                    elif isinstance(child, ast.comprehension):
                        complexity += len(child.ifs)

                entities.append({
                    "id": entity_id,
                    "name": node.name,
                    "type": entity_type,
                    "file": relative_path,
                    "line": node.lineno,
                    "end_line": node.end_lineno,
                    "parent": parent,
                    "complexity": complexity,
                    "decorators": [
                        get_name(d) for d in node.decorator_list
                    ],
                    "parameters": [
                        arg.arg for arg in node.args.args
                    ],
                    "is_async": isinstance(node, ast.AsyncFunctionDef),
                })

                scope_stack.append(entity_id)
                self.generic_visit(node)
                scope_stack.pop()

            def visit_Import(self, node):
                for alias in node.names:
                    imports.append({
                        "module": alias.name,
                        "name": alias.asname or alias.name,
                        "type": "import",
                        "file": relative_path,
                        "line": node.lineno,
                    })

            def visit_ImportFrom(self, node):
                module = node.module or ""

                imports.append({
                    "module": module,
                    "name": None,
                    "type": "from_import",
                    "file": relative_path,
                    "line": node.lineno,
                })

                for alias in node.names:
                    imports.append({
                        "module": module,
                        "name": alias.asname or alias.name,
                        "type": "imported_symbol",
                        "file": relative_path,
                        "line": node.lineno,
                    })

            def visit_Call(self, node):
                calls.append({
                    "name": get_name(node.func),
                    "file": relative_path,
                    "line": node.lineno,
                    "scope": scope_stack[-1] if scope_stack else None,
                })
                self.generic_visit(node)

        Visitor().visit(tree)

        return {
            "file": relative_path,
            "entities": entities,
            "imports": imports,
            "calls": calls,
            "inheritance": inheritance,
            "source": source,
        }

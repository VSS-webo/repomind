
# import chromadb
# from sentence_transformers import SentenceTransformer
# from pathlib import Path

# from app.services.repository_manager import RepositoryManager
# from app.parsers.python_parser import PythonParser
# from app.services.analysis_service import AnalysisService


# BASE_DIR = Path(__file__).resolve().parents[2]
# VECTOR_DIR = BASE_DIR / "vector_db"


# class SearchService:

#     model = SentenceTransformer(
#         "sentence-transformers/all-MiniLM-L6-v2"
#     )

#     client = chromadb.PersistentClient(
#         path=str(VECTOR_DIR)
#     )

#     @classmethod
#     def index_repository(cls, repo_id: str):

#         repo_path = RepositoryManager.get_repository_path(repo_id)

#         collection_name = f"repo_{repo_id.replace('-', '_')}"

#         # Re-index cleanly.
#         try:
#             cls.client.delete_collection(collection_name)
#         except Exception:
#             pass

#         collection = cls.client.create_collection(
#             name=collection_name
#         )

#         ids = []
#         documents = []
#         metadatas = []

#         for file_path in repo_path.rglob("*.py"):

#             if any(
#                 part in AnalysisService.IGNORE_DIRS
#                 for part in file_path.parts
#             ):
#                 continue

#             parsed = PythonParser.parse_file(file_path, repo_path)

#             if not parsed:
#                 continue

#             source = parsed["source"]

#             for entity in parsed["entities"]:

#                 start = entity["line"] - 1
#                 end = entity["end_line"]

#                 lines = source.splitlines()
#                 code = "\n".join(lines[start:end])

#                 if not code.strip():
#                     continue

#                 entity_id = entity["id"]

#                 text = (
#                     f"Type: {entity['type']}\n"
#                     f"Name: {entity['name']}\n"
#                     f"File: {entity['file']}\n"
#                     f"Code:\n{code}"
#                 )

#                 ids.append(entity_id)
#                 documents.append(text)

#                 metadatas.append({
#                     "repo_id": repo_id,
#                     "file": entity["file"],
#                     "name": entity["name"],
#                     "type": entity["type"],
#                     "line": entity["line"],
#                     "end_line": entity["end_line"]
#                 })

#         # Batch embeddings to control RAM usage.
#         batch_size = 64

#         for start in range(0, len(ids), batch_size):

#             batch_docs = documents[start:start + batch_size]
#             batch_ids = ids[start:start + batch_size]
#             batch_metadata = metadatas[start:start + batch_size]

#             embeddings = cls.model.encode(
#                 batch_docs,
#                 convert_to_numpy=True
#             ).tolist()

#             collection.add(
#                 ids=batch_ids,
#                 documents=batch_docs,
#                 embeddings=embeddings,
#                 metadatas=batch_metadata
#             )

#         return {
#             "repo_id": repo_id,
#             "indexed_entities": len(ids),
#             "collection": collection_name
#         }

#     @classmethod
#     def search(cls, repo_id: str, query: str, top_k: int = 5):

#         collection_name = f"repo_{repo_id.replace('-', '_')}"

#         collection = cls.client.get_collection(
#             collection_name
#         )

#         query_embedding = cls.model.encode(
#             query,
#             convert_to_numpy=True
#         ).tolist()

#         results = collection.query(
#             query_embeddings=[query_embedding],
#             n_results=min(top_k, collection.count())
#         )

#         output = []

#         for i in range(len(results["ids"][0])):

#             metadata = results["metadatas"][0][i]

#             output.append({
#                 "id": results["ids"][0][i],
#                 "file": metadata["file"],
#                 "name": metadata["name"],
#                 "type": metadata["type"],
#                 "line": metadata["line"],
#                 "end_line": metadata["end_line"],
#                 "code": results["documents"][0][i],
#                 "distance": results["distances"][0][i]
#             })

#         return {
#             "query": query,
#             "results": output
#         }



import re
import math
import hashlib
from collections import Counter
from pathlib import Path
from typing import Any

import chromadb
from sentence_transformers import SentenceTransformer

from app.services.repository_manager import RepositoryManager
from app.parsers.python_parser import PythonParser
from app.services.analysis_service import AnalysisService


BASE_DIR = Path(__file__).resolve().parents[2]
VECTOR_DIR = BASE_DIR / "vector_db"

# Retrieval configuration
EMBEDDING_MODEL = "BAAI/bge-m3"  #this is 1024 dimensions

CHUNK_LINES = 80
CHUNK_OVERLAP = 15

DENSE_CANDIDATES = 40
LEXICAL_CANDIDATES = 40
MAX_TOP_K = 20


class SearchService:

    # BGE-M3: stronger semantic embedding model.
    model = SentenceTransformer(EMBEDDING_MODEL)

    client = chromadb.PersistentClient(
        path=str(VECTOR_DIR)
    )

    # --------------------------------------------------
    # Helpers
    # --------------------------------------------------

    @staticmethod
    def _collection_name(repo_id: str) -> str:
        return f"repo_{repo_id.replace('-', '_')}"

    @staticmethod
    def _tokenize(text: str) -> list[str]:
        """
        Preserve programming identifiers while also splitting
        snake_case and camelCase into searchable components.
        """

        text = re.sub(
            r"([a-z0-9])([A-Z])",
            r"\1 \2",
            text
        )

        tokens = re.findall(
            r"[a-zA-Z_][a-zA-Z_0-9]*|[0-9]+",
            text.lower()
        )

        expanded = []

        for token in tokens:
            expanded.append(token)

            # snake_case components
            expanded.extend(
                part for part in token.split("_")
                if part
            )

        return expanded

    @staticmethod
    def _stable_id(text: str) -> str:
        return hashlib.sha256(
            text.encode("utf-8")
        ).hexdigest()

    @staticmethod
    def _extract_code(document: str) -> str:
        marker = "\nCode:\n"

        if marker in document:
            return document.split(marker, 1)[1]

        return document

    @staticmethod
    def _bm25_scores(
        query: str,
        documents: list[str]
    ) -> list[float]:

        """
        Lightweight BM25 lexical scoring.

        Useful for exact identifiers, function names,
        filenames and technical keywords.
        """

        if not documents:
            return []

        query_tokens = SearchService._tokenize(query)

        if not query_tokens:
            return [0.0] * len(documents)

        tokenized_docs = [
            SearchService._tokenize(doc)
            for doc in documents
        ]

        doc_lengths = [
            len(tokens)
            for tokens in tokenized_docs
        ]

        avg_length = (
            sum(doc_lengths) / len(doc_lengths)
            if doc_lengths else 1.0
        )

        document_frequency = Counter()

        for tokens in tokenized_docs:
            document_frequency.update(set(tokens))

        total_docs = len(documents)

        k1 = 1.5
        b = 0.75

        scores = []

        for tokens, length in zip(
            tokenized_docs,
            doc_lengths
        ):

            frequencies = Counter(tokens)
            score = 0.0

            for token in query_tokens:

                tf = frequencies.get(token, 0)

                if tf == 0:
                    continue

                df = document_frequency[token]

                idf = math.log(
                    1 + (
                        total_docs - df + 0.5
                    ) / (
                        df + 0.5
                    )
                )

                denominator = tf + k1 * (
                    1 - b + b * length / max(avg_length, 1)
                )

                score += idf * (
                    tf * (k1 + 1)
                ) / denominator

            scores.append(score)

        return scores

    @staticmethod
    def _normalize_scores(
        scores: list[float]
    ) -> list[float]:

        if not scores:
            return []

        maximum = max(scores)

        if maximum <= 0:
            return [0.0] * len(scores)

        return [
            score / maximum
            for score in scores
        ]

    # --------------------------------------------------
    # Indexing
    # --------------------------------------------------

    @classmethod
    def index_repository(
        cls,
        repo_id: str
    ) -> dict[str, Any]:

        repo_path = Path(
            RepositoryManager.get_repository_path(repo_id)
        )

        if not repo_path.exists():
            raise FileNotFoundError(
                f"Repository does not exist: {repo_path}"
            )

        collection_name = cls._collection_name(repo_id)

        # Re-index cleanly.
        try:
            cls.client.delete_collection(
                collection_name
            )
        except Exception:
            pass

        collection = cls.client.create_collection(
            name=collection_name,
            metadata={
                "hnsw:space": "cosine",
                "embedding_model": EMBEDDING_MODEL
            }
        )

        ids = []
        documents = []
        metadatas = []

        indexed_files = 0
        indexed_entities = 0
        indexed_chunks = 0

        for file_path in repo_path.rglob("*.py"):

            if any(
                part in AnalysisService.IGNORE_DIRS
                for part in file_path.parts
            ):
                continue

            try:
                parsed = PythonParser.parse_file(
                    file_path,
                    repo_path
                )
            except Exception as exc:
                print(
                    f"Skipping {file_path}: {exc}"
                )
                continue

            if not parsed:
                continue

            source = parsed.get("source", "")

            if not source:
                continue

            lines = source.splitlines()

            indexed_files += 1

            for entity in parsed.get("entities", []):

                entity_start = max(
                    0,
                    int(entity["line"]) - 1
                )

                entity_end = min(
                    len(lines),
                    int(entity["end_line"])
                )

                entity_lines = lines[
                    entity_start:entity_end
                ]

                if not entity_lines:
                    continue

                entity_code = "\n".join(
                    entity_lines
                )

                indexed_entities += 1

                # Split large entities into manageable
                # overlapping chunks.
                chunks = []

                if len(entity_lines) <= CHUNK_LINES:

                    chunks.append(
                        (
                            entity_start + 1,
                            entity_end,
                            entity_code
                        )
                    )

                else:

                    step = (
                        CHUNK_LINES - CHUNK_OVERLAP
                    )

                    for offset in range(
                        0,
                        len(entity_lines),
                        step
                    ):

                        chunk_lines = entity_lines[
                            offset:offset + CHUNK_LINES
                        ]

                        if not chunk_lines:
                            break

                        chunk_start = (
                            entity_start + offset + 1
                        )

                        chunk_end = (
                            chunk_start
                            + len(chunk_lines)
                            - 1
                        )

                        chunks.append(
                            (
                                chunk_start,
                                chunk_end,
                                "\n".join(chunk_lines)
                            )
                        )

                        if (
                            offset + CHUNK_LINES
                            >= len(entity_lines)
                        ):
                            break

                for chunk_index, (
                    chunk_start,
                    chunk_end,
                    code
                ) in enumerate(chunks):

                    if not code.strip():
                        continue

                    entity_type = entity.get(
                        "type",
                        "unknown"
                    )

                    entity_name = entity.get(
                        "name",
                        "unknown"
                    )

                    entity_file = entity.get(
                        "file",
                        str(file_path.relative_to(repo_path))
                    )

                    # Richer context improves retrieval.
                    text = (
                        f"Language: Python\n"
                        f"Type: {entity_type}\n"
                        f"Name: {entity_name}\n"
                        f"File: {entity_file}\n"
                        f"Entity start line: {entity_start + 1}\n"
                        f"Chunk lines: {chunk_start}-{chunk_end}\n"
                        f"Code:\n{code}"
                    )

                    entity_id = str(
                        entity.get(
                            "id",
                            f"{entity_file}:{entity_start + 1}"
                        )
                    )

                    chunk_id = cls._stable_id(
                        f"{repo_id}:{entity_id}:{chunk_index}:{chunk_start}"
                    )

                    ids.append(chunk_id)
                    documents.append(text)

                    metadatas.append({
                        "repo_id": repo_id,
                        "file": str(entity_file),
                        "name": str(entity_name),
                        "type": str(entity_type),
                        "line": int(chunk_start),
                        "end_line": int(chunk_end),
                        "entity_line": int(entity_start + 1),
                        "entity_end_line": int(entity_end),
                        "entity_id": entity_id,
                        "chunk_index": int(chunk_index),
                    })

                    indexed_chunks += 1

        # Batch embedding to control RAM.
        batch_size = 16

        for start in range(
            0,
            len(ids),
            batch_size
        ):

            batch_docs = documents[
                start:start + batch_size
            ]

            batch_ids = ids[
                start:start + batch_size
            ]

            batch_metadata = metadatas[
                start:start + batch_size
            ]

            embeddings = cls.model.encode(
                batch_docs,
                batch_size=batch_size,
                normalize_embeddings=True,
                convert_to_numpy=True,
                show_progress_bar=False
            ).tolist()

            collection.add(
                ids=batch_ids,
                documents=batch_docs,
                embeddings=embeddings,
                metadatas=batch_metadata
            )

        return {
            "repo_id": repo_id,
            "indexed_files": indexed_files,
            "indexed_entities": indexed_entities,
            "indexed_chunks": indexed_chunks,
            "collection": collection_name,
            "embedding_model": EMBEDDING_MODEL
        }

    # --------------------------------------------------
    # Search
    # --------------------------------------------------

    @classmethod
    def search(
        cls,
        repo_id: str,
        query: str,
        top_k: int = 5
    ) -> dict[str, Any]:

        query = query.strip()

        if not query:
            raise ValueError(
                "Search query cannot be empty"
            )

        top_k = max(
            1,
            min(int(top_k), MAX_TOP_K)
        )

        collection_name = cls._collection_name(
            repo_id
        )

        collection = cls.client.get_collection(
            collection_name
        )

        total_count = collection.count()

        if total_count == 0:
            return {
                "query": query,
                "results": [],
                "total_indexed_chunks": 0
            }

        # ------------------------------------------
        # 1. Dense retrieval
        # ------------------------------------------

        query_embedding = cls.model.encode(
            query,
            normalize_embeddings=True,
            convert_to_numpy=True
        ).tolist()

        dense_count = min(
            total_count,
            max(
                DENSE_CANDIDATES,
                top_k * 8
            )
        )

        dense_results = collection.query(
            query_embeddings=[
                query_embedding
            ],
            n_results=dense_count,
            include=[
                "documents",
                "metadatas",
                "distances"
            ]
        )

        candidates = {}

        dense_ids = dense_results["ids"][0]
        dense_docs = dense_results["documents"][0]
        dense_metadata = dense_results["metadatas"][0]
        dense_distances = dense_results["distances"][0]

        for doc_id, doc, metadata, distance in zip(
            dense_ids,
            dense_docs,
            dense_metadata,
            dense_distances
        ):

            # Cosine distance -> similarity.
            dense_similarity = max(
                0.0,
                min(
                    1.0,
                    1.0 - float(distance) / 2.0
                )
            )

            candidates[doc_id] = {
                "id": doc_id,
                "document": doc,
                "metadata": metadata,
                "distance": float(distance),
                "dense_score": dense_similarity,
                "lexical_score": 0.0
            }

        # ------------------------------------------
        # 2. Lexical retrieval
        # ------------------------------------------

        corpus = collection.get(
            include=[
                "documents",
                "metadatas"
            ]
        )

        corpus_ids = corpus["ids"]
        corpus_docs = corpus["documents"]
        corpus_metadata = corpus["metadatas"]

        lexical_scores = cls._bm25_scores(
            query,
            corpus_docs
        )

        lexical_top_indices = sorted(
            range(len(lexical_scores)),
            key=lambda index: lexical_scores[index],
            reverse=True
        )[:LEXICAL_CANDIDATES]

        lexical_max = (
            max(lexical_scores)
            if lexical_scores else 0.0
        )

        for index in lexical_top_indices:

            score = lexical_scores[index]

            if score <= 0:
                continue

            doc_id = corpus_ids[index]

            normalized_lexical = (
                score / lexical_max
                if lexical_max > 0
                else 0.0
            )

            if doc_id in candidates:

                candidates[doc_id][
                    "lexical_score"
                ] = normalized_lexical

            else:

                candidates[doc_id] = {
                    "id": doc_id,
                    "document": corpus_docs[index],
                    "metadata": corpus_metadata[index],
                    "distance": None,
                    "dense_score": 0.0,
                    "lexical_score": normalized_lexical
                }

        # ------------------------------------------
        # 3. Hybrid ranking
        # ------------------------------------------

        query_tokens = set(
            cls._tokenize(query)
        )

        ranked = []

        for candidate in candidates.values():

            metadata = candidate["metadata"]

            name_tokens = set(
                cls._tokenize(
                    metadata.get("name", "")
                )
            )

            file_tokens = set(
                cls._tokenize(
                    metadata.get("file", "")
                )
            )

            document_tokens = set(
                cls._tokenize(
                    candidate["document"]
                )
            )

            name_match = bool(
                query_tokens & name_tokens
            )

            file_match = bool(
                query_tokens & file_tokens
            )

            overlap = (
                len(query_tokens & document_tokens)
                / max(len(query_tokens), 1)
            )

            dense_score = candidate[
                "dense_score"
            ]

            lexical_score = candidate[
                "lexical_score"
            ]

            # Hybrid score. Exact names and identifiers
            # are rewarded without overpowering semantics.
            final_score = (
                0.55 * dense_score
                + 0.35 * lexical_score
                + 0.10 * overlap
            )

            if name_match:
                final_score += 0.12

            if file_match:
                final_score += 0.05

            candidate["score"] = min(
                final_score,
                1.0
            )

            candidate["name_match"] = name_match
            candidate["file_match"] = file_match

            ranked.append(candidate)

        ranked.sort(
            key=lambda item: item["score"],
            reverse=True
        )

        # ------------------------------------------
        # 4. Deduplicate overlapping chunks
        # ------------------------------------------

        output = []
        seen = set()

        for candidate in ranked:

            metadata = candidate["metadata"]

            # Avoid repeated chunks from same entity
            # when they overlap heavily.
            dedup_key = (
                metadata.get("file"),
                metadata.get("name"),
                metadata.get("entity_line"),
            )

            if dedup_key in seen:
                continue

            seen.add(dedup_key)

            document = candidate["document"]

            output.append({
                "id": candidate["id"],
                "file": metadata.get("file"),
                "name": metadata.get("name"),
                "type": metadata.get("type"),
                "line": metadata.get("line"),
                "end_line": metadata.get("end_line"),
                "entity_line": metadata.get("entity_line"),
                "entity_end_line": metadata.get("entity_end_line"),
                "chunk_index": metadata.get("chunk_index"),
                "code": document,
                "snippet": cls._extract_code(document),
                "distance": candidate["distance"],
                "similarity": round(
                    candidate["score"],
                    4
                ),
                "dense_score": round(
                    candidate["dense_score"],
                    4
                ),
                "lexical_score": round(
                    candidate["lexical_score"],
                    4
                ),
                "name_match": candidate["name_match"],
                "file_match": candidate["file_match"]
            })

            if len(output) >= top_k:
                break

        return {
            "query": query,
            "results": output,
            "total_indexed_chunks": total_count,
            "retrieval": "hybrid"
        }

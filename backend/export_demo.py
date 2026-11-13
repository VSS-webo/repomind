
import json
import os
from pathlib import Path

import requests

# --------------------------------------------------
# CONFIGURATION
# --------------------------------------------------

API_URL = "http://127.0.0.1:8000"

# Paste the Chronix repository ID from Swagger here
REPO_ID = "c039c1a6-6331-4210-b7dd-b4748ed27ab5"

OUTPUT_DIR = Path("../frontend/public/demo/chronix")

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# --------------------------------------------------
# HELPER: FETCH API DATA
# --------------------------------------------------

def fetch(endpoint, params=None):
    url = f"{API_URL}{endpoint}"

    response = requests.get(url, params=params)
    response.raise_for_status()

    return response.json()


def save_json(filename, data):
    path = OUTPUT_DIR / filename

    with open(path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=2, ensure_ascii=False)

    print(f"Saved: {path}")


# --------------------------------------------------
# EXPORT REPOSITORY METADATA
# --------------------------------------------------

print("\nExporting repository metadata...")

repository = fetch(f"/api/repositories/{REPO_ID}")

save_json("repository.json", repository)


# --------------------------------------------------
# EXPORT GRAPH
# --------------------------------------------------

print("\nExporting repository graph...")

graph = fetch(f"/api/repositories/{REPO_ID}/graph")

save_json("graph.json", graph)


# --------------------------------------------------
# EXPORT SEARCH EXAMPLES
# --------------------------------------------------

print("\nExporting search examples...")

search_queries = [
    "Where are HTTP retries handled?",
    "Where are the main classes defined?",
    "How is the repository structured?"
]

search_data = {}

for query in search_queries:
    print(f"Searching: {query}")

    try:
        result = fetch(
            f"/api/repositories/{REPO_ID}/search",
            params={"q": query, "top_k": 5}
        )

        search_data[query] = result

    except Exception as error:
        print(f"Search failed: {error}")

save_json("search.json", search_data)


# --------------------------------------------------
# EXPORT COMPLETE
# --------------------------------------------------

print("\n===================================")
print("CHRONIX DEMO EXPORT COMPLETED")
print("===================================")
print(f"Output directory: {OUTPUT_DIR.resolve()}")
print("\nGenerated files:")

for file in OUTPUT_DIR.glob("*.json"):
    print(f" - {file.name}")

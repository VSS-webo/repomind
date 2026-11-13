print("JAI SHRIRAM")


import re
import shutil
import uuid
from pathlib import Path

from git import Repo
from git.exc import GitCommandError


BASE_DIR = Path(__file__).resolve().parents[2]
REPOSITORIES_DIR = BASE_DIR / "repositories"
REPOSITORIES_DIR.mkdir(exist_ok=True)

# Only accept public GitHub repository URLs.
GITHUB_URL_PATTERN = re.compile(
    r"^https://github\.com/([A-Za-z0-9_.-]+)/"
    r"([A-Za-z0-9_.-]+?)(?:\.git)?/?$"
)


class RepositoryManager:

    @staticmethod
    def validate_url(url: str):
        match = GITHUB_URL_PATTERN.fullmatch(url.strip())

        if not match:
            raise ValueError(
                "Invalid URL. Please provide a public GitHub repository URL."
            )

        owner, repo_name = match.groups()

        # GitHub usernames and repository names cannot end with a dot.
        if owner.endswith(".") or repo_name.endswith("."):
            raise ValueError("Invalid GitHub repository name.")

        return owner, repo_name

    @staticmethod
    def clone_repository(url: str):
        owner, repo_name = RepositoryManager.validate_url(url)

        repo_id = str(uuid.uuid4())

        # Store each repository in its own directory.
        repo_path = REPOSITORIES_DIR / repo_id

        try:
            Repo.clone_from(
                url.strip(),
                str(repo_path),
                depth=1,
                multi_options=["--single-branch"],
            )

            repo = Repo(repo_path)

            return {
                "repo_id": repo_id,
                "owner": owner,
                "repo_name": repo_name,
                "path": str(repo_path),
                "branch": repo.active_branch.name,
                "commit": repo.head.commit.hexsha,
            }

        except Exception:
            # Remove incomplete clone if anything fails.
            if repo_path.exists():
                shutil.rmtree(repo_path, ignore_errors=True)

            raise

    @staticmethod
    def get_repository_path(repo_id: str):
        # Prevent path traversal.
        try:
            uuid.UUID(repo_id)
        except ValueError:
            raise ValueError("Invalid repository ID.")

        repo_path = (REPOSITORIES_DIR / repo_id).resolve()

        if repo_path.parent != REPOSITORIES_DIR.resolve():
            raise ValueError("Invalid repository path.")

        if not repo_path.exists():
            raise FileNotFoundError("Repository not found.")

        return repo_path

    @staticmethod
    def delete_repository(repo_id: str):
        repo_path = RepositoryManager.get_repository_path(repo_id)

        shutil.rmtree(repo_path)

        return {
            "repo_id": repo_id,
            "deleted": True,
        }

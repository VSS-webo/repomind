
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
});

export const cloneRepository = async (url: string) => {
  try {
    const response = await api.post("/api/repositories", { url });
    return response.data;
  } catch (error: any) {
    console.error("Clone API error:", error);

    if (error.response) {
      throw new Error(
        error.response.data?.detail || "Repository cloning failed"
      );
    }

    if (error.request) {
      throw new Error(
        "Cannot reach backend. Check whether FastAPI is running."
      );
    }

    throw new Error(error.message || "Unexpected error");
  }
};
export const analyzeRepository = async (id: string) => {
  const response = await api.post(`/api/repositories/${id}/analyze`);
  return response.data;
};

export const getRepository = async (id: string) => {
  const response = await api.get(`/api/repositories/${id}`);
  return response.data;
};

export const getGraph = async (id: string) => {
  const response = await api.get(`/api/repositories/${id}/graph`);
  return response.data;
};

export const searchRepository = async (
  id: string,
  q: string,
  top_k = 5
) => {
  const response = await api.get(`/api/repositories/${id}/search`, {
    params: { q, top_k },
  });
  return response.data;
};

export const askRepository = async (
  id: string,
  question: string,
  top_k = 6
) => {
  const response = await api.post(`/api/repositories/${id}/ask`, {
    question,
    top_k,
  });
  return response.data;
};


export const reviewCode = async (
  diff: string,
  repoId?: string
) => {
  const response = await api.post("/api/review", {
    diff,
    repo_id: repoId,
  });

  return response.data;
};

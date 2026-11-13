
export const DEMO_BASE = "/demo/chronix";

export async function getDemoData<T>(filename: string): Promise<T> {
  const response = await fetch(`${DEMO_BASE}/${filename}`);

  if (!response.ok) {
    throw new Error(`Failed to load demo data: ${filename}`);
  }

  return response.json();
}

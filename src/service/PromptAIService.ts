import { auth } from "@/main";

interface GeneratePromptResponse {
  template: string | null;
  variaveis: Record<string, string> | null;
  promptFinal: string;
  usadas: string[];
}

const API_URL = import.meta.env.VITE_PROMPTAI_API_URL; 

export async function gerarPromptComIA(
  userMessage: string,
  profile: unknown
): Promise<GeneratePromptResponse> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  const idToken = await user.getIdToken();


  const response = await fetch(`${API_URL}/generate-prompt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ userMessage, profile }),
  });

  if (!response.ok) {
    const erro = await response.json().catch(() => null);
    throw new Error(erro?.error || "Não foi possível gerar o prompt");
  }

  return response.json();
}
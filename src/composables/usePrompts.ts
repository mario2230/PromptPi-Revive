import { reactive } from 'vue';
import type { PromptItem } from '@/composables/useMockData';
import { buscarPrompts, atualizarFavorito as atualizarFavoritoFirestore } from '@/service/PromptService';

export const prompts = reactive<PromptItem[]>([]);

export function findPrompt(id: string) {
  return prompts.find((prompt) => prompt.id === id);
}

export function upsertPrompt(prompt: PromptItem) {
  const index = prompts.findIndex((item) => item.id === prompt.id);
  if (index === -1) prompts.unshift(prompt);
  else Object.assign(prompts[index], prompt);
}

export async function carregarPrompts(uid: string) {
  prompts.splice(0, prompts.length);
  const salvos = await buscarPrompts(uid);
  prompts.push(...salvos);
  return salvos;
}

export async function alternarFavorito(uid: string, id: string) {
  const prompt = findPrompt(id);
  if (!prompt) throw new Error('Prompt não encontrado');

  const favorito = !prompt.favorito;
  await atualizarFavoritoFirestore(uid, id, favorito);
  prompt.favorito = favorito;
}
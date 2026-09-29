import { collection, doc, getDocs, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/main';
import type { PromptItem } from '@/composables/useMockData';

export type PromptDraft = Omit<PromptItem, 'id'> & { id?: string };

function promptsCollection(uid: string) {
  if (!uid) throw new Error('Usuário não autenticado');
  return collection(db, 'users', uid, 'prompts');
}

export async function salvarPrompt(uid: string, prompt: PromptDraft): Promise<PromptItem> {
  const promptsRef = promptsCollection(uid);
  const promptRef = prompt.id ? doc(promptsRef, prompt.id) : doc(promptsRef);
  const salvo: PromptItem = { ...prompt, id: promptRef.id };

  await setDoc(promptRef, {
    ...salvo,
    atualizadoEm: serverTimestamp(),
    ...(!prompt.id && { criadoEm: serverTimestamp() }),
  }, { merge: true });

  return salvo;
}

export async function buscarPrompts(uid: string): Promise<PromptItem[]> {
  const snapshot = await getDocs(promptsCollection(uid));
  return snapshot.docs.map((promptDoc) => {
    const data = promptDoc.data();
    return {
      id: promptDoc.id,
      titulo: data.titulo ?? '',
      categoria: data.categoria ?? '',
      favorito: data.favorito ?? false,
      desc: data.desc ?? '',
      template: data.template ?? '',
      vars: data.vars ?? {},
      usadas: data.usadas ?? [],
      data: data.data ?? 'hoje',
      usos: data.usos ?? 0,
    };
  });
}

export async function atualizarFavorito(uid: string, id: string, favorito: boolean): Promise<void> {
  await updateDoc(doc(promptsCollection(uid), id), {
    favorito,
    atualizadoEm: serverTimestamp(),
  });
}
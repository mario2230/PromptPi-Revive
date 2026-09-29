import { reactive, ref } from 'vue';

export type ChatMessage =
  | { role: 'user'; text: string }
  | { role: 'thinking' }
  | {
      role: 'result';
      id: string;
      titulo: string;
      corpo: string;
      usadas: string[];
      template?: string | null;
      vars?: Record<string, string> | null;
    };

export const chatLog = reactive<ChatMessage[]>([]);
export const chatDraft = ref('');

export function resetChat() {
  chatLog.splice(0, chatLog.length);
  chatDraft.value = '';
}
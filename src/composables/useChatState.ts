import { reactive } from 'vue';

export type ChatMessage =
  | { role: 'user'; text: string }
  | { role: 'thinking' }
  | { role: 'result'; id: string; titulo: string; corpo: string; usadas: string[] };

export const chatLog = reactive<ChatMessage[]>([]);

export function resetChat() {
  chatLog.splice(0, chatLog.length);
}

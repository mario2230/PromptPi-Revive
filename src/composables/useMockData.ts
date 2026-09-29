import { reactive } from 'vue';

/* =========================================================
   PromptPI — dados mockados
   Tudo aqui é fake/local. Quando o backend existir, troque
   estas funções por chamadas à API mantendo a mesma "forma".
   ========================================================= */

export interface PromptItem {
  id: string;
  titulo: string;
  categoria: string;
  favorito: boolean;
  desc: string;
  template: string;
  vars: Record<string, string>;
  usadas: string[];
  data: string;
  usos: number;
}

export interface Category {
  id: string;
  nome: string;
  icon: string; // nome do ícone (ionicons), resolvido nas telas
}

export interface Conversation {
  id: string;
  titulo: string;
  dia: string;
}

export const account = reactive({
  name: 'Mario Andrade',
  email: 'mario.andrade@email.com',
  createdAt: '12 mar 2025',
  initials: 'MA',
});

export const aiProfile = reactive({
  profissao: 'Desenvolvedor',
  area: 'Desenvolvimento Web',
  nivel: 'Intermediário',
  tecnologias: ['PHP', 'Vue.js', 'Ionic'] as string[],
  idioma: 'Português',
  tom: 'Direto e prático',
  estilo: 'Didático e objetivo',
  objetivos: 'Melhorar programação e escrever com mais clareza',
});

export const prefs = reactive({
  respostasDiretas: true,
  usarExemplos: true,
  explicacoesDetalhadas: false,
  linguagemSimples: true,
  responderPortugues: true,
});

export const categories = reactive<Category[]>([
  { id: 'programacao', nome: 'Programação', icon: 'code-slash-outline' },
  { id: 'estudos', nome: 'Estudos', icon: 'book-outline' },
  { id: 'trabalho', nome: 'Trabalho', icon: 'briefcase-outline' },
  { id: 'escrita', nome: 'Escrita', icon: 'create-outline' },
  { id: 'marketing', nome: 'Marketing', icon: 'megaphone-outline' },
  { id: 'pesquisa', nome: 'Pesquisa', icon: 'search-outline' },
  { id: 'produtividade', nome: 'Produtividade', icon: 'checkmark-done-outline' },
  { id: 'criatividade', nome: 'Criatividade', icon: 'color-wand-outline' },
]);

export const conversations = reactive<Conversation[]>([
  { id: 'c1', titulo: 'Prompt para revisar PHP', dia: 'Hoje' },
  { id: 'c2', titulo: 'Prompt para estudar matemática', dia: 'Hoje' },
  { id: 'c3', titulo: 'Prompt para currículo', dia: 'Ontem' },
  { id: 'c4', titulo: 'Prompt para escrever relatório', dia: 'Ontem' },
  { id: 'c5', titulo: 'Ideias de post sobre Vue.js', dia: '12 set' },
  { id: 'c6', titulo: 'Resumo de artigo sobre IA', dia: '12 set' },
]);

/* ---------------- helpers ---------------- */

export function fillTemplate(tpl: string, vars: Record<string, string>): string {
  if (!tpl) return '';
  return tpl.replace(/\{([a-zA-Z0-9_]+)\}/g, (m, k) => (vars && vars[k]) ? vars[k] : m);
}

export function extractVars(tpl: string): string[] {
  if (!tpl) return [];
  const matches = tpl.match(/\{([a-zA-Z0-9_]+)\}/g) || [];
  return [...new Set(matches.map((m) => m.slice(1, -1)))];
}

export function categoryById(id: string) {
  return categories.find((c) => c.id === id);
}

/**
 * Gera um prompt "personalizado" combinando o texto do usuário com o
 * perfil de IA. Isso é um MOCK simples baseado em palavras-chave — o
 * ponto de troca futuro por uma chamada real de IA é esta função.
 */
export function generateMockPrompt(userText: string): { titulo: string; corpo: string; usadas: string[] } {
  const p = aiProfile;
  const lower = userText.toLowerCase();
  const tecnologia = p.tecnologias[0] || 'sua stack';
  let usadas = ['Profissão', 'Área', 'Nível', 'Tom de resposta'];
  let corpo: string;

  if (lower.includes('cód') || lower.includes('cod') || lower.includes('bug') || lower.includes('program')) {
    corpo = `Você é um especialista em ${p.area}.\n\nAnalise o código a seguir desenvolvido com ${tecnologia}.\n\nMeu nível de conhecimento é ${p.nivel.toLowerCase()}.\n\nExplique os problemas encontrados de forma ${p.tom.toLowerCase()}, com exemplos práticos de correção.\n\nCódigo:\n[cole seu código aqui]`;
    usadas.push('Tecnologia');
  } else if (lower.includes('email') || lower.includes('e-mail') || lower.includes('mensagem')) {
    corpo = `Revise o texto abaixo mantendo um tom ${p.tom.toLowerCase()}.\n\nMantenha direto, claro e educado.\n\nIdioma: ${p.idioma}.\n\nTexto:\n[cole seu texto aqui]`;
    usadas = ['Tom de resposta', 'Idioma'];
  } else if (lower.includes('estud') || lower.includes('aprend') || lower.includes('explic')) {
    corpo = `Explique o assunto abaixo para alguém no nível ${p.nivel.toLowerCase()}.\n\nUse uma linguagem ${p.tom.toLowerCase()} e traga pelo menos um exemplo prático.\n\nAssunto:\n${userText}`;
    usadas = ['Nível', 'Tom de resposta', 'Idioma'];
  } else {
    corpo = `Você é um especialista em ${p.area}.\n\nAjude-me com: ${userText}.\n\nConsidere meu nível ${p.nivel.toLowerCase()} e responda em um tom ${p.tom.toLowerCase()}.\n\nIdioma: ${p.idioma}.`;
  }

  const titulo = userText.length > 42 ? userText.slice(0, 42) + '…' : userText;
  return { titulo, corpo, usadas };
}

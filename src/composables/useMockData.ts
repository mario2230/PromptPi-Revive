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

export const prompts = reactive<PromptItem[]>([
  {
    id: 'p1', titulo: 'Revisão de código PHP', categoria: 'programacao', favorito: true,
    desc: 'Analisa problemas e sugere melhorias em código PHP considerando boas práticas.',
    template: 'Você é um especialista em {area}.\n\nAnalise meu código desenvolvido utilizando {tecnologia}.\n\nMeu nível de conhecimento é {nivel}.\n\nExplique os problemas de maneira {tom}, com exemplos práticos.\n\nCódigo:\n{codigo}',
    vars: { area: 'desenvolvimento web', tecnologia: 'PHP', nivel: 'intermediário', tom: 'direta e prática', codigo: '[cole seu código aqui]' },
    usadas: ['Profissão', 'Área', 'Nível', 'Tecnologia', 'Tom de resposta'], data: '18 set 2026', usos: 12,
  },
  {
    id: 'p2', titulo: 'Explicar conceito para estudo', categoria: 'estudos', favorito: false,
    desc: 'Transforma qualquer assunto em uma explicação didática com exemplos.',
    template: 'Explique o conceito de {assunto} para alguém no nível {nivel}.\n\nUse uma linguagem {tom} e traga pelo menos um exemplo prático.\n\nEvite jargões sem explicá-los antes.',
    vars: { assunto: '[o que você quer estudar]', nivel: 'intermediário', tom: 'direta e prática' },
    usadas: ['Nível', 'Tom de resposta', 'Idioma'], data: '15 set 2026', usos: 5,
  },
  {
    id: 'p3', titulo: 'Revisar e-mail profissional', categoria: 'trabalho', favorito: true,
    desc: 'Deixa e-mails de trabalho mais claros, objetivos e com o tom certo.',
    template: 'Revise o e-mail abaixo mantendo um tom {tom}.\n\nDeixe direto, sem perder a educação.\n\nIdioma: {idioma}.\n\nE-mail:\n{texto}',
    vars: { tom: 'direto e prático', idioma: 'português', texto: '[cole seu e-mail aqui]' },
    usadas: ['Tom de resposta', 'Idioma'], data: '10 set 2026', usos: 8,
  },
  {
    id: 'p4', titulo: 'Gerar ideias de post', categoria: 'marketing', favorito: false,
    desc: 'Cria variações de posts para redes sociais a partir de um tema.',
    template: 'Crie 5 variações de post sobre {tema} para {rede}.\n\nTom: {tom}.\n\nPúblico: {publico}.',
    vars: { tema: '[seu tema]', rede: 'Instagram', tom: 'direto e prático', publico: 'desenvolvedores' },
    usadas: ['Tom de resposta'], data: '6 set 2026', usos: 2,
  },
  {
    id: 'p5', titulo: 'Resumo de artigo técnico', categoria: 'pesquisa', favorito: false,
    desc: 'Resume artigos técnicos mantendo os pontos essenciais.',
    template: 'Resuma o texto abaixo em tópicos claros, nível {nivel}.\n\nDestaque conceitos-chave em negrito.\n\nTexto:\n{texto}',
    vars: { nivel: 'intermediário', texto: '[cole o artigo aqui]' },
    usadas: ['Nível', 'Idioma'], data: '2 set 2026', usos: 3,
  },
  {
    id: 'p6', titulo: 'Planejar rotina de estudos', categoria: 'produtividade', favorito: false,
    desc: 'Monta um plano de estudos semanal com base no seu tempo disponível.',
    template: 'Monte um plano de estudos semanal sobre {assunto}.\n\nTenho {tempo} disponíveis por dia.\n\nMeu nível é {nivel}.',
    vars: { assunto: '[assunto]', tempo: '1 hora', nivel: 'intermediário' },
    usadas: ['Nível'], data: '28 ago 2026', usos: 1,
  },
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

export function toggleFavorite(id: string) {
  const p = prompts.find((x) => x.id === id);
  if (p) p.favorito = !p.favorito;
}

export function categoryById(id: string) {
  return categories.find((c) => c.id === id);
}

export function findPrompt(id: string) {
  return prompts.find((p) => p.id === id);
}

export function createOrUpdatePrompt(payload: {
  id?: string; titulo: string; desc: string; categoria: string; template: string;
}) {
  if (payload.id) {
    const p = findPrompt(payload.id);
    if (p) Object.assign(p, { titulo: payload.titulo, desc: payload.desc, categoria: payload.categoria, template: payload.template });
    return p;
  }
  const novo: PromptItem = {
    id: 'p' + (prompts.length + 1) + '-' + Date.now(),
    titulo: payload.titulo, desc: payload.desc, categoria: payload.categoria, template: payload.template,
    vars: {}, usadas: [], favorito: false, data: 'hoje', usos: 0,
  };
  prompts.unshift(novo);
  return novo;
}

export function saveGeneratedPrompt(titulo: string, corpo: string, usadas: string[]) {
  const novo: PromptItem = {
    id: 'p' + (prompts.length + 1) + '-' + Date.now(),
    titulo, categoria: 'produtividade', favorito: false,
    desc: corpo.slice(0, 90) + '…', template: corpo, vars: {}, usadas, data: 'hoje', usos: 0,
  };
  prompts.unshift(novo);
  return novo;
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

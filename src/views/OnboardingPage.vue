<template>
  <ion-page>
    <ion-content :fullscreen="true" class="screen-center">
      <div class="onb-wrap">
        <div class="onb-progress">
          <span v-for="(s, i) in steps" :key="s.key">
            <i :style="{ width: i <= stepIndex ? '100%' : '0%' }"></i>
          </span>
        </div>
        <div class="onb-step-label">{{ current.label }} · {{ stepIndex + 1 }} de {{ steps.length }}</div>
        <div class="onb-q">{{ current.q }}</div>

        <div class="onb-options">
          <div
            v-for="opt in current.options" :key="opt"
            class="chip-native" :class="{ selected: isSelected(opt) }"
            @click="select(opt)"
          >
            <ion-icon v-if="current.multi && isSelected(opt)" :icon="checkmarkOutline" class="ic-sm" />
            {{ opt }}
          </div>
        </div>

        <div class="onb-nav">
          <ion-button fill="clear" color="medium" :style="stepIndex === 0 ? 'visibility:hidden' : ''" @click="back">
            <ion-icon slot="start" :icon="chevronBackOutline" />Voltar
          </ion-button>
          <ion-button color="primary" style="--border-radius: 10px" :disabled="!canNext" @click="next">
            {{ stepIndex === steps.length - 1 ? 'Concluir' : 'Continuar' }}
            <ion-icon slot="end" :icon="chevronForwardOutline" />
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/vue';
import { checkmarkOutline, chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { aiProfile } from '@/composables/useMockData';

const router = useRouter();

interface Step { key: string; label: string; q: string; multi: boolean; options: string[]; }

const steps: Step[] = [
  { key: 'profissao', label: 'Sobre você', q: 'Qual é a sua profissão?', multi: false, options: ['Desenvolvedor', 'Estudante', 'Designer', 'Gestor', 'Escritor', 'Outro'] },
  { key: 'area', label: 'Sobre você', q: 'Em qual área você trabalha ou estuda?', multi: false, options: ['Tecnologia', 'Marketing', 'Educação', 'Design', 'Negócios', 'Outro'] },
  { key: 'nivel', label: 'Conhecimento', q: 'Qual seu nível nessa área?', multi: false, options: ['Iniciante', 'Intermediário', 'Avançado'] },
  { key: 'prefResposta', label: 'Preferências', q: 'Como você prefere receber respostas?', multi: false, options: ['Diretas', 'Detalhadas', 'Didáticas', 'Técnicas'] },
  { key: 'tom', label: 'Tom', q: 'Qual tom você prefere?', multi: false, options: ['Profissional', 'Casual', 'Didático', 'Direto', 'Criativo'] },
  { key: 'contexto', label: 'Contexto', q: 'Em quais áreas você costuma usar IA?', multi: true, options: ['Programação', 'Estudos', 'Trabalho', 'Escrita', 'Pesquisa'] },
  { key: 'tecnologias', label: 'Ferramentas', q: 'Quais tecnologias ou ferramentas você utiliza?', multi: true, options: ['PHP', 'JavaScript', 'Vue', 'Ionic', 'Python', 'Figma'] },
];

const stepIndex = ref(0);
const current = computed(() => steps[stepIndex.value]);

const answers = reactive<Record<string, string | string[]>>({
  profissao: '', area: '', nivel: '', prefResposta: '', tom: '', contexto: [], tecnologias: [],
});

function isSelected(opt: string) {
  const v = answers[current.value.key];
  return current.value.multi ? (v as string[]).includes(opt) : v === opt;
}
function select(opt: string) {
  if (current.value.multi) {
    const arr = answers[current.value.key] as string[];
    const i = arr.indexOf(opt);
    if (i > -1) arr.splice(i, 1); else arr.push(opt);
  } else {
    answers[current.value.key] = opt;
  }
}
const canNext = computed(() => {
  const v = answers[current.value.key];
  return current.value.multi ? (v as string[]).length > 0 : !!v;
});

function back() { if (stepIndex.value > 0) stepIndex.value--; }
function next() {
  if (stepIndex.value < steps.length - 1) {
    stepIndex.value++;
    return;
  }
  // aplica as respostas no perfil de IA (mock)
  if (answers.profissao) aiProfile.profissao = answers.profissao as string;
  if (answers.area) aiProfile.area = answers.area as string;
  if (answers.nivel) aiProfile.nivel = answers.nivel as string;
  if (answers.tom) aiProfile.tom = answers.tom as string;
  const tecs = answers.tecnologias as string[];
  if (tecs.length) aiProfile.tecnologias = tecs;
  router.replace('/app/tabs/chat');
}
</script>

<style scoped>
.screen-center {
  --background:
    radial-gradient(ellipse 900px 500px at 12% -8%, rgba(139, 108, 255, 0.22), transparent 60%),
    radial-gradient(ellipse 800px 600px at 105% 105%, rgba(62, 92, 231, 0.2), transparent 60%),
    var(--ion-background-color);
}
.onb-wrap { max-width: 520px; margin: 0 auto; padding: 56px 20px; }
.onb-progress { display: flex; gap: 6px; margin-bottom: 34px; }
.onb-progress span { flex: 1; height: 3px; background: var(--pp-border); border-radius: 3px; overflow: hidden; }
.onb-progress span i { display: block; height: 100%; background: linear-gradient(90deg, var(--pp-primary), var(--pp-blue)); width: 0%; }
.onb-step-label { color: var(--pp-muted); font-size: 12.5px; margin-bottom: 10px; }
.onb-q { font-family: var(--pp-font-voice); font-size: 24px; font-weight: 500; margin: 0 0 24px; line-height: 1.3; }
.onb-options { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px; }
.chip-native {
  display: inline-flex; align-items: center; gap: 6px; padding: 11px 17px; border-radius: 20px;
  border: 1px solid var(--pp-border); background: var(--pp-surface); color: var(--pp-text);
  font-size: 14.5px; cursor: pointer; transition: all 0.15s ease; user-select: none;
}
.chip-native:hover { border-color: var(--pp-muted-2); }
.chip-native.selected { background: rgba(139, 108, 255, 0.16); border-color: var(--pp-primary); color: var(--pp-lilac); }
.onb-nav { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
</style>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button :default-href="backHref" /></ion-buttons>
        <ion-title class="pp-title">{{ editing ? 'Editar prompt' : 'Criar prompt' }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="content-narrow">
        <div class="panel">
          <ion-item class="pp-item" lines="none">
            <ion-label position="stacked">Nome</ion-label>
            <ion-input v-model="titulo" placeholder="Ex: Revisão de código PHP" />
          </ion-item>

          <ion-item class="pp-item" lines="none">
            <ion-label position="stacked">Descrição</ion-label>
            <ion-input v-model="desc" placeholder="Do que se trata este prompt" />
          </ion-item>

          <ion-item class="pp-item" lines="none">
            <ion-label position="stacked">Categoria</ion-label>
            <ion-select v-model="categoria" interface="popover" placeholder="Sem categoria">
              <ion-select-option value="">Sem categoria</ion-select-option>
              <ion-select-option v-for="c in categories" :key="c.id" :value="c.id">{{ c.nome }}</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item class="pp-item" lines="none">
            <ion-label position="stacked">Template — use {variavel} para criar campos reutilizáveis</ion-label>
            <ion-textarea v-model="template" :auto-grow="true" :rows="7" placeholder="Você é especialista em {area}..." />
          </ion-item>

          <div class="tag" v-if="detected.length" style="margin: 4px 0 16px">
            Variáveis detectadas:
            <span class="pill" v-for="v in detected" :key="v">{{ '{' + v + '}' }}</span>
          </div>

          <div class="action-row">
            <ion-button color="primary" style="--border-radius: 9px" :disabled="saving" @click="salvar">
              {{ saving ? 'Salvando...' : 'Salvar prompt' }}
            </ion-button>
            <ion-button fill="clear" color="medium" @click="router.push(backHref)">Cancelar</ion-button>
          </div>
        </div>
      </div>
    </ion-content>
    <ion-toast :is-open="toastOpen" :message="toastText" :duration="2000" position="bottom" @didDismiss="toastOpen = false" />
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent,
  IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption, IonButton, IonToast,
} from '@ionic/vue';
import { categories, extractVars } from '@/composables/useMockData';
import { carregarPrompts, findPrompt, upsertPrompt } from '../composables/usePrompts';
import { auth } from '@/main';
import { salvarPrompt } from '@/service/PromptService';

const route = useRoute();
const router = useRouter();

// id "new" (ou ausência de :id) = criação; qualquer outro valor = edição
const idParam = route.params.id as string | undefined;
const editing = computed(() => !!idParam && idParam !== 'new');
const existing = computed(() => editing.value ? findPrompt(idParam as string) : undefined);

const titulo = ref(existing.value?.titulo || '');
const desc = ref(existing.value?.desc || '');
const categoria = ref(existing.value?.categoria || '');
const template = ref(existing.value?.template || '');

const detected = computed(() => extractVars(template.value));
const backHref = computed(() => (editing.value && existing.value ? `/app/prompts/${existing.value.id}` : '/app/tabs/prompts'));

const toastOpen = ref(false);
const toastText = ref('');
const saving = ref(false);
function toast(msg: string) { toastText.value = msg; toastOpen.value = true; }

onMounted(async () => {
  if (!editing.value || existing.value || !auth.currentUser) return;
  try {
    await carregarPrompts(auth.currentUser.uid);
    const prompt = findPrompt(idParam as string);
    if (prompt) {
      titulo.value = prompt.titulo;
      desc.value = prompt.desc;
      categoria.value = prompt.categoria;
      template.value = prompt.template;
    }
  } catch (error) {
    toast(error instanceof Error ? error.message : 'Não foi possível carregar o prompt');
  }
});

async function salvar() {
  if (!titulo.value.trim()) { toast('Dê um nome ao prompt antes de salvar'); return; }
  if (!auth.currentUser) { toast('Entre na sua conta para salvar prompts'); return; }

  saving.value = true;
  try {
    const salvo = await salvarPrompt(auth.currentUser.uid, {
      id: editing.value ? idParam : undefined,
      titulo: titulo.value.trim(),
      desc: desc.value.trim(),
      categoria: categoria.value,
      template: template.value,
      favorito: existing.value?.favorito ?? false,
      vars: existing.value?.vars ?? {},
      usadas: existing.value?.usadas ?? [],
      data: new Date().toLocaleDateString('pt-BR'),
      usos: existing.value?.usos ?? 0,
    });
    upsertPrompt(salvo);
    toast(editing.value ? 'Alterações salvas' : 'Prompt criado');
    router.replace(`/app/prompts/${salvo.id}`);
  } catch (error) {
    toast(error instanceof Error ? error.message : 'Não foi possível salvar o prompt');
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.pp-title { font-family: var(--pp-font-voice); font-weight: 500; }
.content-narrow { max-width: 680px; margin: 0 auto; }
.panel { background: var(--pp-surface); border: 1px solid var(--pp-border); border-radius: 14px; padding: 20px 22px; }
.pp-item { --background: var(--ion-background-color); --border-radius: 10px; margin-bottom: 14px; --border-color: var(--pp-border); }
.tag { font-size: 12.5px; color: var(--pp-muted); }
.pill {
  display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 12px;
  background: rgba(139, 108, 255, 0.16); color: var(--pp-lilac); border: 1px solid var(--pp-border); margin-left: 6px;
}
.action-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 8px; }
</style>

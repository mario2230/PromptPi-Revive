<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button default-href="/app/tabs/prompts" /></ion-buttons>
        <ion-title class="pp-title">Prompt</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding" v-if="prompt">
      <div class="content-narrow">
        <div class="detail-title">{{ prompt.titulo }}</div>
        <div class="detail-meta">
          <span class="pill">{{ categoryName }}</span>
          <span class="tag">{{ prompt.usos }} usos · atualizado em {{ prompt.data }}</span>
        </div>

        <div class="panel">
          <h4>Descrição</h4>
          <div class="desc">{{ prompt.desc }}</div>
        </div>

        <div class="panel">
          <h4>Prompt</h4>
          <div class="prompt-body">{{ finalText }}</div>
          <div class="action-row">
            <ion-button size="small" color="primary" style="--border-radius: 8px" @click="copyText(finalText)">
              <ion-icon slot="start" :icon="copyOutline" />Copiar prompt
            </ion-button>
            <ion-button size="small" fill="outline" color="medium" style="--border-radius: 8px" @click="router.push(`/app/prompts/${prompt.id}/edit`)">
              <ion-icon slot="start" :icon="createOutline" />Editar
            </ion-button>
            <ion-button size="small" fill="clear" color="medium" @click="structOpen = true">
              <ion-icon slot="start" :icon="layersOutline" />Ver estrutura
            </ion-button>
            <ion-button size="small" fill="clear" color="medium" @click="favoritar">
              <ion-icon slot="start" :icon="prompt.favorito ? star : starOutline" />
              {{ prompt.favorito ? 'Remover dos favoritos' : 'Favoritar' }}
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>

    <ion-content class="ion-padding" v-else>
      <div class="empty-state">
        <ion-icon :icon="documentsOutline" />
        <h3>Prompt não encontrado</h3>
        <p>Ele pode ter sido removido.</p>
        <ion-button color="primary" style="--border-radius: 10px" @click="router.replace('/app/tabs/prompts')">Voltar</ion-button>
      </div>
    </ion-content>

    <StructureModal
      v-if="prompt" :is-open="structOpen" :template="prompt.template" :vars="prompt.vars" :usadas="prompt.usadas"
      @close="structOpen = false"
    />
    <ion-toast :is-open="toastOpen" :message="toastText" :duration="2000" position="bottom" @didDismiss="toastOpen = false" />
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent,
  IonButton, IonIcon, IonToast,
} from '@ionic/vue';
import { copyOutline, createOutline, layersOutline, star, starOutline, documentsOutline } from 'ionicons/icons';
import { categoryById, fillTemplate } from '@/composables/useMockData';
import { alternarFavorito, carregarPrompts, findPrompt } from '@/composables/usePrompts';
import { auth } from '@/main';
import StructureModal from '@/components/StructureModal.vue';

const route = useRoute();
const router = useRouter();

const prompt = computed(() => findPrompt(route.params.id as string));
const categoryName = computed(() => (prompt.value ? categoryById(prompt.value.categoria)?.nome || 'Sem categoria' : ''));
const finalText = computed(() => (prompt.value ? fillTemplate(prompt.value.template, prompt.value.vars) : ''));

const structOpen = ref(false);
const toastOpen = ref(false);
const toastText = ref('');
function toast(msg: string) { toastText.value = msg; toastOpen.value = true; }

onMounted(async () => {
  if (!auth.currentUser || prompt.value) return;
  try {
    await carregarPrompts(auth.currentUser.uid);
  } catch (error) {
    toast(error instanceof Error ? error.message : 'Não foi possível carregar o prompt');
  }
});

function copyText(text: string) {
  navigator.clipboard?.writeText(text).catch(() => {});
  toast('Prompt copiado');
}
async function favoritar() {
  if (!prompt.value || !auth.currentUser) {
    toast('Entre na sua conta para alterar favoritos');
    return;
  }
  try {
    await alternarFavorito(auth.currentUser.uid, prompt.value.id);
  } catch (error) {
    toast(error instanceof Error ? error.message : 'Não foi possível atualizar o favorito');
  }
}
</script>

<style scoped>
.pp-title { font-family: var(--pp-font-voice); font-weight: 500; }
.content-narrow { max-width: 680px; margin: 0 auto; }
.detail-title { font-family: var(--pp-font-voice); font-size: 23px; font-weight: 500; margin: 0 0 8px; }
.detail-meta { display: flex; gap: 10px; align-items: center; margin-bottom: 20px; flex-wrap: wrap; }
.tag { font-size: 12.5px; color: var(--pp-muted); }
.pill {
  display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 12px;
  background: rgba(139, 108, 255, 0.16); color: var(--pp-lilac); border: 1px solid var(--pp-border);
}
.panel { background: var(--pp-surface); border: 1px solid var(--pp-border); border-radius: 14px; padding: 20px 22px; margin-bottom: 16px; }
.panel h4 { font-size: 12.5px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--pp-muted); margin: 0 0 12px; font-weight: 600; }
.desc { font-size: 14px; color: var(--pp-text); line-height: 1.6; }
.prompt-body { font-family: var(--pp-font-voice); font-size: 15px; line-height: 1.7; white-space: pre-wrap; }
.action-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; }
.empty-state { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 70px 20px; color: var(--pp-muted); }
.empty-state ion-icon { font-size: 38px; color: var(--pp-muted-2); margin-bottom: 16px; }
.empty-state h3 { font-family: var(--pp-font-voice); font-weight: 500; font-size: 18px; color: var(--pp-text); margin: 0 0 6px; }
</style>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="pp-title">Meus Prompts</ion-title>
        <ion-buttons slot="end">
          <ion-button color="primary" fill="solid" style="--border-radius: 9px" @click="router.push('/app/prompts/new/edit')">
            <ion-icon slot="start" :icon="addOutline" />Novo
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="section-sub">Todos os prompts que você criou ou salvou.</div>

      <div class="filter-row">
        <div class="filter-tabs">
          <button class="tab-btn" :class="{ active: filter === 'todos' }" @click="filter = 'todos'">Todos</button>
          <button class="tab-btn" :class="{ active: filter === 'favoritos' }" @click="filter = 'favoritos'">Favoritos</button>
          <button class="tab-btn" :class="{ active: filter === 'recentes' }" @click="filter = 'recentes'">Recentes</button>
        </div>
        <div class="quick-links">
          <button class="link-btn" @click="router.push('/app/categorias')"><ion-icon :icon="gridOutline" /> Categorias</button>
          <button class="link-btn" @click="router.push('/app/historico')"><ion-icon :icon="timeOutline" /> Histórico</button>
        </div>
      </div>

      <div class="searchbar">
        <ion-icon :icon="searchOutline" />
        <input v-model="search" placeholder="Buscar prompts..." />
      </div>

      <PromptGrid :filter="filter" :search="search" />
    </ion-content>
    <ion-toast :is-open="toastOpen" :message="toastText" :duration="2500" position="bottom" @didDismiss="toastOpen = false" />
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonToast } from '@ionic/vue';
import { addOutline, searchOutline, gridOutline, timeOutline } from 'ionicons/icons';
import PromptGrid from '@/components/PromptGrid.vue';
import { categoryById } from '@/composables/useMockData';
import { carregarPrompts } from '@/composables/usePrompts';
import { auth } from '@/main';
import { buscarPrompts } from '@/service/PromptService';

const router = useRouter();
const route = useRoute();
const filter = ref<'todos' | 'favoritos' | 'recentes'>('todos');

const catId = route.query.categoria as string | undefined;
const search = ref(catId ? (categoryById(catId)?.nome || '') : '');
const toastOpen = ref(false);
const toastText = ref('');

onMounted(async () => {
  if (!auth.currentUser) return;
  try {
    await carregarPrompts(auth.currentUser.uid);
  } catch (error) {
    toastText.value = error instanceof Error ? error.message : 'Não foi possível carregar seus prompts';
    toastOpen.value = true;
  }
});
</script>

<style scoped>
.pp-title { font-family: var(--pp-font-voice); font-weight: 600; }
.section-sub {
  color: var(--pp-muted); font-size: 13.5px; margin: 0 0 18px; letter-spacing: 0.01em;
}
.filter-row {
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 18px;
}
.filter-tabs {
  display: flex; gap: 8px; padding: 6px; background: rgba(26, 33, 69, 0.55); border: 1px solid var(--pp-border);
  border-radius: 14px;
}
.tab-btn {
  background: transparent; border: 1px solid transparent; color: var(--pp-muted); padding: 8px 13px; border-radius: 10px;
  font-size: 13.5px; font-weight: 600; transition: all 0.2s ease;
}
.tab-btn.active {
  background: linear-gradient(135deg, rgba(139, 108, 255, 0.18), rgba(62, 92, 231, 0.13));
  border-color: rgba(139, 108, 255, 0.38); color: var(--pp-text); box-shadow: inset 0 0 0 1px rgba(139,108,255,0.15);
}
.quick-links { display: flex; gap: 12px; flex-wrap: wrap; }
.link-btn {
  display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.02); border: 1px solid var(--pp-border);
  border-radius: 10px; color: var(--pp-muted); font-size: 13px; padding: 8px 12px; transition: all 0.2s ease;
}
.link-btn:hover { border-color: rgba(139,108,255,0.4); color: var(--pp-text); }
.searchbar {
  display: flex; align-items: center; gap: 8px; background: linear-gradient(180deg, rgba(18, 24, 56, 0.82), rgba(15, 19, 41, 0.9));
  border: 1px solid var(--pp-border); border-radius: 14px; padding: 12px 14px; margin-bottom: 22px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.02);
}
.searchbar ion-icon { color: var(--pp-muted-2); font-size: 18px; }
.searchbar input {
  background: none; border: none; outline: none; color: var(--pp-text); font-size: 14px; width: 100%; font-family: inherit;
}
.searchbar input::placeholder { color: var(--pp-muted-2); }
</style>

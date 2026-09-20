<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button default-href="/app/tabs/prompts" /></ion-buttons>
        <ion-title class="pp-title">Histórico</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="section-sub">Suas conversas com a IA — diferente dos prompts salvos em Meus Prompts.</div>

      <div class="hist-group" v-for="(items, dia) in grouped" :key="dia">
        <div class="hist-day">{{ dia }}</div>
        <ion-list lines="none" class="hist-list">
          <ion-item button v-for="c in items" :key="c.id" class="hist-item" @click="abrir">
            <ion-icon slot="start" :icon="chatbubbleEllipsesOutline" class="hist-icon" />
            <ion-label>{{ c.titulo }}</ion-label>
          </ion-item>
        </ion-list>
      </div>
    </ion-content>
    <ion-toast :is-open="toastOpen" message="Abrindo conversa (mock)" :duration="1800" position="bottom" @didDismiss="toastOpen = false" />
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent,
  IonList, IonItem, IonLabel, IonIcon, IonToast,
} from '@ionic/vue';
import { chatbubbleEllipsesOutline } from 'ionicons/icons';
import { conversations } from '@/composables/useMockData';

const toastOpen = ref(false);
function abrir() { toastOpen.value = true; }

const grouped = computed(() => {
  const g: Record<string, typeof conversations> = {};
  conversations.forEach((c) => { (g[c.dia] = g[c.dia] || []).push(c); });
  return g;
});
</script>

<style scoped>
.pp-title { font-family: var(--pp-font-voice); font-weight: 500; }
.section-sub { color: var(--pp-muted); font-size: 13.5px; margin: 0 0 22px; }
.hist-group { margin-bottom: 22px; }
.hist-day { font-size: 12.5px; color: var(--pp-muted-2); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
.hist-list { --background: transparent; background: transparent; }
.hist-item { --background: var(--pp-surface); --border-radius: 10px; margin-bottom: 6px; }
.hist-icon { color: var(--pp-muted-2); }
</style>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="pp-title">Favoritos</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="section-sub">Acesso rápido aos prompts que você mais usa.</div>
      <PromptGrid :only-favorites="true" />
    </ion-content>
    <ion-toast :is-open="toastOpen" :message="toastText" :duration="2500" position="bottom" @didDismiss="toastOpen = false" />
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonToast } from '@ionic/vue';
import PromptGrid from '@/components/PromptGrid.vue';
import { auth } from '@/main';
import { carregarPrompts } from '@/composables/usePrompts';

const toastOpen = ref(false);
const toastText = ref('');

onMounted(async () => {
  if (!auth.currentUser) return;
  try {
    await carregarPrompts(auth.currentUser.uid);
  } catch (error) {
    toastText.value = error instanceof Error ? error.message : 'Não foi possível carregar seus favoritos';
    toastOpen.value = true;
  }
});
</script>

<style scoped>
.pp-title { font-family: var(--pp-font-voice); font-weight: 500; }
.section-sub { color: var(--pp-muted); font-size: 13.5px; margin: 0 0 20px; }
</style>

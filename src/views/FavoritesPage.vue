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
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import PromptGrid from '@/components/PromptGrid.vue';
</script>

<style scoped>
.pp-title { font-family: var(--pp-font-voice); font-weight: 500; }
.section-sub { color: var(--pp-muted); font-size: 13.5px; margin: 0 0 20px; }
</style>

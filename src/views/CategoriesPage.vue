<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button default-href="/app/tabs/prompts" /></ion-buttons>
        <ion-title class="pp-title">Categorias</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="section-sub">Organize seus prompts por área de uso.</div>
      <div class="cat-grid">
        <div class="cat-card" v-for="c in categories" :key="c.id" @click="abrir(c.id)">
          <div class="cat-icon"><ion-icon :icon="resolveIcon(c.icon)" /></div>
          <div class="cat-name">{{ c.nome }}</div>
          <div class="cat-count">{{ countFor(c.id) }} {{ countFor(c.id) === 1 ? 'prompt' : 'prompts' }}</div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent, IonIcon } from '@ionic/vue';
import {
  codeSlashOutline, bookOutline, briefcaseOutline, createOutline, megaphoneOutline,
  searchOutline, checkmarkDoneOutline, colorWandOutline, gridOutline,
} from 'ionicons/icons';
import { categories } from '@/composables/useMockData';
import { prompts, carregarPrompts } from '@/composables/usePrompts';
import { auth } from '@/main';

const router = useRouter();

const ICONS: Record<string, any> = {
  'code-slash-outline': codeSlashOutline,
  'book-outline': bookOutline,
  'briefcase-outline': briefcaseOutline,
  'create-outline': createOutline,
  'megaphone-outline': megaphoneOutline,
  'search-outline': searchOutline,
  'checkmark-done-outline': checkmarkDoneOutline,
  'color-wand-outline': colorWandOutline,
};
function resolveIcon(name: string) { return ICONS[name] || gridOutline; }
function countFor(id: string) { return prompts.filter((p) => p.categoria === id).length; }
function abrir(id: string) { router.push({ path: '/app/tabs/prompts', query: { categoria: id } }); }

onMounted(() => {
  if (auth.currentUser) carregarPrompts(auth.currentUser.uid).catch(() => {});
});
</script>

<style scoped>
.pp-title { font-family: var(--pp-font-voice); font-weight: 500; }
.section-sub { color: var(--pp-muted); font-size: 13.5px; margin: 0 0 20px; }
.cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
.cat-card { background: var(--pp-surface); border: 1px solid var(--pp-border); border-radius: 14px; padding: 18px; cursor: pointer; }
.cat-card:active { border-color: var(--pp-primary); }
.cat-icon {
  width: 36px; height: 36px; border-radius: 10px; background: rgba(139, 108, 255, 0.16); color: var(--pp-lilac);
  display: flex; align-items: center; justify-content: center; margin-bottom: 12px; font-size: 18px;
}
.cat-name { font-weight: 600; font-size: 14.5px; margin-bottom: 2px; }
.cat-count { font-size: 12.5px; color: var(--pp-muted-2); }
</style>

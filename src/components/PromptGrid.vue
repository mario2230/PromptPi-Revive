<template>
  <div class="card-grid" v-if="list.length">
    <PromptCard
      v-for="p in list"
      :key="p.id"
      :prompt="p"
      @open="(id) => router.push(`/app/prompts/${id}`)"
      @toggle-favorite="toggleFavorite"
    />
  </div>
  <div class="empty-state" v-else>
    <ion-icon :icon="documentsOutline" />
    <h3>Nenhum prompt encontrado</h3>
    <p>Ajuste a busca ou crie um novo prompt personalizado.</p>

  </div>
  <ion-toast :is-open="toastOpen" :message="toastText" :duration="2200" position="bottom" @didDismiss="toastOpen = false" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonIcon, IonButton, IonToast } from '@ionic/vue';
import { documentsOutline, addOutline } from 'ionicons/icons';
import { prompts, alternarFavorito, type PromptItem } from '@/composables/usePrompts';
import { auth } from '@/main';
import PromptCard from '@/components/PromptCard.vue';

const props = defineProps<{
  onlyFavorites?: boolean;
  filter?: 'todos' | 'favoritos' | 'recentes';
  search?: string;
}>();

const router = useRouter();
const toastOpen = ref(false);
const toastText = ref('');

const list = computed<PromptItem[]>(() => {
  let l = prompts.slice();
  if (props.onlyFavorites) {
    l = l.filter((p) => p.favorito);
  } else if (props.filter === 'favoritos') {
    l = l.filter((p) => p.favorito);
  } else if (props.filter === 'recentes') {
    l = l.slice(0, 4);
  }
  if (props.search && props.search.trim()) {
    const q = props.search.toLowerCase();
    l = l.filter((p) => p.titulo.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
  }
  return l;
});

async function toggleFavorite(id: string) {
  if (!auth.currentUser) {
    toastText.value = 'Entre na sua conta para alterar favoritos';
    toastOpen.value = true;
    return;
  }
  try {
    await alternarFavorito(auth.currentUser.uid, id);
  } catch (error) {
    toastText.value = error instanceof Error ? error.message : 'Não foi possível atualizar o favorito';
    toastOpen.value = true;
  }
}
</script>

<style scoped>
.card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; }
.empty-state { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 60px 20px; color: var(--pp-muted); }
.empty-state ion-icon { font-size: 38px; color: var(--pp-muted-2); margin-bottom: 16px; }
.empty-state h3 { font-family: var(--pp-font-voice); font-weight: 500; font-size: 18px; color: var(--pp-text); margin: 0 0 6px; }
.empty-state p { font-size: 13.5px; margin: 0 0 20px; max-width: 300px; }
</style>

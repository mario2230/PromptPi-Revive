<template>
  <div class="pcard" @click="$emit('open', prompt.id)">
    <div class="pcard-top">
      <div class="pcard-title">{{ prompt.titulo }}</div>
      <button class="pcard-fav" :class="{ on: prompt.favorito }" @click.stop="$emit('toggle-favorite', prompt.id)">
        <ion-icon :icon="prompt.favorito ? star : starOutline" />
      </button>
    </div>
    <div class="pcard-desc">{{ prompt.desc }}</div>
    <div class="pcard-meta">
      <span class="pill">{{ categoryName }}</span>
      <span>{{ prompt.usos }} usos</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonIcon } from '@ionic/vue';
import { star, starOutline } from 'ionicons/icons';
import { categoryById, type PromptItem } from '@/composables/useMockData';

const props = defineProps<{ prompt: PromptItem }>();
defineEmits<{ open: [id: string]; 'toggle-favorite': [id: string] }>();

const categoryName = computed(() => categoryById(props.prompt.categoria)?.nome || 'Sem categoria');
</script>

<style scoped>
.pcard {
  background: linear-gradient(180deg, rgba(26, 33, 69, 0.92), rgba(18, 24, 56, 0.96));
  border: 1px solid var(--pp-border);
  border-radius: 18px;
  padding: 18px 17px 16px;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 10px 20px rgba(7, 10, 20, 0.2);
}
.pcard:hover {
  transform: translateY(-2px);
  border-color: rgba(139, 108, 255, 0.8);
  box-shadow: 0 14px 28px rgba(139, 108, 255, 0.12);
}
.pcard-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
.pcard-title {
  font-size: 15px; font-weight: 700; line-height: 1.35; color: var(--pp-text);
  max-width: calc(100% - 28px);
}
.pcard-fav {
  color: var(--pp-muted-2); cursor: pointer; background: rgba(255,255,255,0.04); border: 1px solid transparent;
  display: flex; padding: 7px; font-size: 17px; border-radius: 10px; transition: all 0.2s ease;
}
.pcard-fav.on {
  color: #ffd76a; background: rgba(255, 215, 106, 0.08); border-color: rgba(255, 215, 106, 0.2);
}
.pcard-desc {
  font-size: 13px; color: var(--pp-muted); line-height: 1.55; margin-bottom: 14px;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.pcard-meta {
  display: flex; justify-content: space-between; align-items: center; gap: 8px; font-size: 11.5px; color: var(--pp-muted-2);
}
.pill {
  display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 999px; font-size: 11.5px;
  background: rgba(139, 108, 255, 0.16); color: var(--pp-lilac); border: 1px solid rgba(139, 108, 255, 0.28);
}
</style>

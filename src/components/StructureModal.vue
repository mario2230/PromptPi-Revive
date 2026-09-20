<template>
  <ion-modal :is-open="isOpen" @didDismiss="$emit('close')" class="structure-modal">
    <ion-header>
      <ion-toolbar>
        <ion-title>Estrutura do prompt</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$emit('close')">
            <ion-icon slot="icon-only" :icon="closeOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="tpl-block" v-html="highlighted"></div>

      <div v-if="varEntries.length">
        <div class="var-row" v-for="[k, v] in varEntries" :key="k">
          <span class="k">{{ '{' + k + '}' }}</span>
          <span class="v">{{ v }}</span>
        </div>
      </div>
      <div class="tag" v-else>Este prompt ainda não tem variáveis preenchidas.</div>

      <template v-if="usadas && usadas.length">
        <hr class="hairline" />
        <div class="tag" style="margin-bottom: 8px">Personalização utilizada</div>
        <div class="used-info">
          <span v-for="u in usadas" :key="u" class="used-item">
            <ion-icon :icon="checkmarkOutline" class="ok" /> {{ u }}
          </span>
        </div>
      </template>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent } from '@ionic/vue';
import { closeOutline, checkmarkOutline } from 'ionicons/icons';

const props = defineProps<{
  isOpen: boolean;
  template: string;
  vars?: Record<string, string>;
  usadas?: string[];
}>();
defineEmits<{ close: [] }>();

function escapeHtml(str: string) {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

const highlighted = computed(() =>
  escapeHtml(props.template || '').replace(/\{([a-zA-Z0-9_]+)\}/g, '<span class="var">{$1}</span>')
);
const varEntries = computed(() => Object.entries(props.vars || {}));
</script>

<style scoped>
.tpl-block {
  font-family: var(--pp-font-voice); font-size: 14.5px; line-height: 1.7; white-space: pre-wrap;
  background: var(--ion-background-color); border: 1px solid var(--pp-border-soft); border-radius: 10px;
  padding: 14px 16px; margin-bottom: 16px;
}
.tpl-block :deep(.var) { color: var(--pp-lilac); font-weight: 600; }
.var-row { display: flex; justify-content: space-between; align-items: baseline; padding: 9px 0; border-bottom: 1px solid var(--pp-border-soft); font-size: 13.5px; }
.var-row:last-child { border-bottom: none; }
.var-row .k { color: var(--pp-muted); font-family: var(--pp-font-voice); }
.var-row .v { font-weight: 500; text-align: right; }
.tag { font-size: 12.5px; color: var(--pp-muted); }
.hairline { border: none; border-top: 1px solid var(--pp-border-soft); margin: 18px 0; }
.used-info { font-size: 12.5px; color: var(--pp-muted-2); display: flex; flex-wrap: wrap; gap: 4px 12px; }
.used-item { display: inline-flex; align-items: center; gap: 4px; }
.ok { color: var(--pp-success); }
</style>

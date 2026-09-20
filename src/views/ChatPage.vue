<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button fill="clear" @click="novaConversa">
            <ion-icon slot="icon-only" :icon="addCircleOutline" />
          </ion-button>
        </ion-buttons>
        <ion-title class="pp-title">Chat</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content ref="contentEl" class="chat-content">
      <div class="chat-inner">
        <div v-if="chatLog.length === 0" class="chat-empty">
          <h1>O que você quer criar?</h1>
          <p>Descreva sua necessidade e o PromptPI monta um prompt personalizado com base no seu perfil.</p>
          <div class="suggest-grid">
            <div class="suggest-card" v-for="s in suggestions" :key="s.t" @click="fillSuggestion(s.t)">
              <div class="t">{{ s.t }}</div>
              <div class="s">{{ s.s }}</div>
            </div>
          </div>
        </div>

        <template v-else>
          <div v-for="(m, i) in chatLog" :key="i">
            <div v-if="m.role === 'user'" class="msg user"><div class="msg-bubble">{{ m.text }}</div></div>

            <div v-else-if="m.role === 'thinking'" class="msg-think">
              <ion-icon :icon="sparklesOutline" class="ic-sm" />
              <span>Personalizando com seu perfil</span>
              <span class="dot-flash"><span></span><span></span><span></span></span>
            </div>

            <div v-else-if="m.role === 'result'" class="prompt-card">
              <div class="prompt-card-head"><div class="lbl"><ion-icon :icon="sparklesOutline" class="ic-sm" /> Prompt gerado</div></div>
              <div class="prompt-card-body">{{ m.corpo }}</div>
              <div class="used-info">
                <span v-for="u in m.usadas" :key="u" class="used-item"><ion-icon :icon="checkmarkOutline" class="ok ic-sm" /> {{ u }}</span>
                &nbsp;· {{ m.usadas.length }} informações utilizadas
              </div>
              <div class="prompt-card-foot">
                <ion-button size="small" color="primary" style="--border-radius: 8px" @click="copyText(m.corpo)">
                  <ion-icon slot="start" :icon="copyOutline" />Copiar
                </ion-button>
                <ion-button size="small" fill="outline" color="medium" style="--border-radius: 8px" @click="salvar(m)">
                  <ion-icon slot="start" :icon="saveOutline" />Salvar
                </ion-button>
                <ion-button size="small" fill="clear" color="medium" @click="regenerar(i)">
                  <ion-icon slot="start" :icon="refreshOutline" />Regenerar
                </ion-button>
                <ion-button size="small" fill="clear" color="medium" @click="abrirEstrutura(m)">
                  <ion-icon slot="start" :icon="layersOutline" />Ver estrutura
                </ion-button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </ion-content>

    <div class="chat-inputbar">
      <div class="chat-inputwrap">
        <ion-textarea
          v-model="draft" :auto-grow="true" :rows="1" placeholder="Descreva o que você precisa..."
          @keydown="onKeydown"
        />
        <button class="send-btn" :disabled="!draft.trim()" @click="enviar">
          <ion-icon :icon="sendOutline" />
        </button>
      </div>
    </div>

    <StructureModal
      :is-open="structOpen" :template="structTemplate" :vars="{}" :usadas="structUsadas"
      @close="structOpen = false"
    />
    <ion-toast :is-open="toastOpen" :message="toastText" :duration="2200" position="bottom" @didDismiss="toastOpen = false" />
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonTextarea, IonToast,
} from '@ionic/vue';
import {
  addCircleOutline, sparklesOutline, checkmarkOutline, copyOutline, saveOutline,
  refreshOutline, layersOutline, sendOutline,
} from 'ionicons/icons';
import { chatLog, resetChat, type ChatMessage } from '@/composables/useChatState';
import { generateMockPrompt, saveGeneratedPrompt } from '@/composables/useMockData';
import StructureModal from '@/components/StructureModal.vue';

const suggestions = [
  { t: 'Revisar código', s: 'Encontrar bugs e melhorar um trecho de código' },
  { t: 'Estudar um assunto', s: 'Explicação didática com exemplos' },
  { t: 'Escrever um e-mail', s: 'Tom profissional e direto' },
  { t: 'Gerar ideias', s: 'Brainstorm para um projeto ou post' },
];

const draft = ref('');
const contentEl = ref();

const toastOpen = ref(false);
const toastText = ref('');
function toast(msg: string) { toastText.value = msg; toastOpen.value = true; }

const structOpen = ref(false);
const structTemplate = ref('');
const structUsadas = ref<string[]>([]);

function novaConversa() { resetChat(); }
function fillSuggestion(text: string) { draft.value = text; }

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); }
}

function scrollDown() {
  requestAnimationFrame(() => contentEl.value?.$el?.scrollToBottom?.(150));
}

function enviar() {
  const text = draft.value.trim();
  if (!text) return;
  chatLog.push({ role: 'user', text });
  draft.value = '';
  scrollDown();
  chatLog.push({ role: 'thinking' });
  scrollDown();
  setTimeout(() => {
    chatLog.pop();
    const gerado = generateMockPrompt(text);
    chatLog.push({ role: 'result', id: 'gen-' + Date.now(), ...gerado });
    scrollDown();
  }, 950);
}

function copyText(text: string) {
  navigator.clipboard?.writeText(text).catch(() => {});
  toast('Prompt copiado');
}
function salvar(m: Extract<ChatMessage, { role: 'result' }>) {
  saveGeneratedPrompt(m.titulo, m.corpo, m.usadas);
  toast('Prompt salvo em Meus Prompts');
}
function regenerar(index: number) {
  const anteriores = chatLog.slice(0, index).filter((x) => x.role === 'user') as Extract<ChatMessage, { role: 'user' }>[];
  const ultimo = anteriores[anteriores.length - 1];
  const gerado = generateMockPrompt(ultimo ? ultimo.text : 'sua solicitação');
  const atual = chatLog[index] as Extract<ChatMessage, { role: 'result' }>;
  chatLog.splice(index, 1, { role: 'result', id: atual.id, ...gerado });
}
function abrirEstrutura(m: Extract<ChatMessage, { role: 'result' }>) {
  structTemplate.value = m.corpo;
  structUsadas.value = m.usadas;
  structOpen.value = true;
}
</script>

<style scoped>
.pp-title { font-family: var(--pp-font-voice); font-weight: 500; }
.chat-content { --padding-top: 8px; }
.chat-inner { max-width: 640px; margin: 0 auto; padding: 4px 12px 20px; }

.chat-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; text-align: center; padding: 40px 12px; }
.chat-empty h1 { font-family: var(--pp-font-voice); font-size: 26px; font-weight: 500; margin: 0 0 10px; }
.chat-empty p { color: var(--pp-muted); font-size: 15px; margin: 0 0 26px; max-width: 380px; }
.suggest-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; max-width: 480px; }
.suggest-card { text-align: left; background: var(--pp-surface); border: 1px solid var(--pp-border); border-radius: 11px; padding: 13px 15px; cursor: pointer; }
.suggest-card:active { border-color: var(--pp-primary); }
.suggest-card .t { font-size: 13.5px; font-weight: 500; margin-bottom: 2px; }
.suggest-card .s { font-size: 12px; color: var(--pp-muted-2); }

.msg { display: flex; margin-bottom: 18px; }
.msg.user { justify-content: flex-end; }
.msg-bubble { max-width: 82%; padding: 12px 16px; border-radius: 14px; font-size: 14.5px; line-height: 1.55; white-space: pre-wrap; }
.msg.user .msg-bubble { background: linear-gradient(135deg, var(--pp-primary), var(--pp-blue)); color: #fff; border-bottom-right-radius: 4px; }

.msg-think { display: flex; align-items: center; gap: 8px; color: var(--pp-muted); font-size: 13.5px; padding: 6px 0 14px; }
.dot-flash { display: inline-flex; gap: 3px; }
.dot-flash span { width: 5px; height: 5px; border-radius: 50%; background: var(--pp-muted-2); animation: dotflash 1s infinite ease-in-out; }
.dot-flash span:nth-child(2) { animation-delay: 0.15s; }
.dot-flash span:nth-child(3) { animation-delay: 0.3s; }
@keyframes dotflash { 0%, 80%, 100% { opacity: 0.25; } 40% { opacity: 1; } }

.prompt-card { background: var(--pp-surface); border: 1px solid var(--pp-border); border-radius: 14px; overflow: hidden; margin: 8px 0 20px; }
.prompt-card-head { display: flex; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--pp-border-soft); }
.prompt-card-head .lbl { font-size: 12px; color: var(--pp-muted); display: flex; align-items: center; gap: 6px; }
.prompt-card-body { padding: 18px 20px; font-family: var(--pp-font-voice); font-size: 15px; line-height: 1.7; white-space: pre-wrap; }
.prompt-card-foot { display: flex; flex-wrap: wrap; gap: 8px; padding: 12px 16px; border-top: 1px solid var(--pp-border-soft); }
.used-info { padding: 0 16px 14px; font-size: 12.5px; color: var(--pp-muted-2); display: flex; flex-wrap: wrap; gap: 4px 6px; align-items: center; }
.used-item { display: inline-flex; align-items: center; gap: 4px; }
.ok { color: var(--pp-success); }

.chat-inputbar { border-top: 1px solid var(--pp-border-soft); padding: 10px 12px 14px; background: var(--ion-background-color); }
.chat-inputwrap {
  max-width: 640px; margin: 0 auto; display: flex; align-items: flex-end; gap: 10px;
  background: var(--pp-surface); border: 1px solid var(--pp-border); border-radius: 16px; padding: 4px 6px 4px 14px;
}
.chat-inputwrap ion-textarea { flex: 1; --padding-start: 0; --padding-end: 0; font-size: 14.5px; }
.send-btn {
  width: 38px; height: 38px; border-radius: 11px; border: none; color: #fff; flex-shrink: 0;
  background: linear-gradient(135deg, var(--pp-primary), var(--pp-blue));
  display: flex; align-items: center; justify-content: center;
}
.send-btn[disabled] { opacity: 0.35; }
</style>

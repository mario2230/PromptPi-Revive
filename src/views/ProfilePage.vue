<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="pp-title">Perfil</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-segment v-model="tab" scrollable>
          <ion-segment-button value="conta"><ion-label>Conta</ion-label></ion-segment-button>
          <ion-segment-button value="ia"><ion-label>Perfil de IA</ion-label></ion-segment-button>
          <ion-segment-button value="prefs"><ion-label>Preferências</ion-label></ion-segment-button>
          <ion-segment-button value="config"><ion-label>Config.</ion-label></ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="content-narrow">

        <!-- Conta -->
        <template v-if="tab === 'conta'">
          <div class="panel">
            <div class="row-between" style="margin-bottom: 20px">
              <div class="who">
                <div class="avatar-lg">{{ account.initials }}</div>
                <div>
                  <div class="acc-name">{{ account.name }}</div>
                  <div class="tag">{{ account.email }}</div>
                </div>
              </div>
              <ion-button size="small" fill="outline" color="medium" style="--border-radius: 8px" @click="toast('Alteração de foto ainda não implementada nesta versão')">
                Alterar foto
              </ion-button>
            </div>
            <ion-input label="Nome" label-placement="stacked" v-model="nomeNovo"></ion-input>
            <div class="kv-row"><span class="kv-label">Email</span><span>{{ email }}</span></div>
            
            <ion-input label="Senha" label-placement="stacked" v-model="senhaNovo"></ion-input>

            <div class="kv-row"><span class="kv-label">Conta criada em</span><span>{{ account.createdAt }}</span></div>
          </div>
          <div class="action-row">
            <ion-button fill="outline" color="medium" style="--border-radius: 9px" @click="salvarNome()">
              <ion-icon slot="start" :icon="createOutline" />Atualizar Nome

            </ion-button>
            <ion-button fill="outline" color="medium" style="--border-radius: 9px" @click="salvarSenha()">
              Alterar senha
            </ion-button>
            <ion-button fill="clear" color="danger" @click="sair()">
              <ion-icon slot="start" :icon="logOutOutline" />Sair da conta
            </ion-button>
          </div>
        </template>

        <!-- Perfil de IA -->
        <template v-else-if="tab === 'ia'">
          <div class="panel">
            <h4>Contexto profissional</h4>
            <div class="kv-row"><span class="kv-label">Profissão</span><span>{{ aiProfile.profissao }}</span></div>
            <div class="kv-row"><span class="kv-label">Área</span><span>{{ aiProfile.area }}</span></div>
            <div class="kv-row"><span class="kv-label">Nível</span><span>{{ aiProfile.nivel }}</span></div>
            <div class="kv-row"><span class="kv-label">Objetivos</span><span class="kv-wrap">{{ aiProfile.objetivos }}</span></div>
          </div>
          <div class="panel">
            <h4>Tecnologias e ferramentas</h4>
            <div class="tech-list"><span class="pill" v-for="t in aiProfile.tecnologias" :key="t">{{ t }}</span></div>
          </div>
          <div class="panel">
            <h4>Comunicação</h4>
            <div class="kv-row"><span class="kv-label">Idioma</span><span>{{ aiProfile.idioma }}</span></div>
            <div class="kv-row"><span class="kv-label">Tom</span><span>{{ aiProfile.tom }}</span></div>
            <div class="kv-row"><span class="kv-label">Estilo</span><span>{{ aiProfile.estilo }}</span></div>
          </div>
          <div class="action-row">
            <ion-button color="primary" style="--border-radius: 9px" @click="toast('Edição do perfil de IA ainda não implementada nesta versão')">
              <ion-icon slot="start" :icon="createOutline" />Editar perfil de IA
            </ion-button>
          </div>
        </template>

        <!-- Preferências -->
        <template v-else-if="tab === 'prefs'">
          <div class="panel">
            <h4>Preferências de resposta</h4>
            <div class="row-between pref-row" v-for="it in prefItems" :key="it.key">
              <span class="pref-label">{{ it.label }}</span>
              <ion-toggle color="primary" :checked="(prefs as any)[it.key]" @ionChange="(prefs as any)[it.key] = $event.detail.checked" />
            </div>
          </div>
          <div class="panel">
            <h4>Estrutura preferida do prompt</h4>
            <div class="tech-list"><span class="pill" v-for="s in estrutura" :key="s">{{ s }}</span></div>
          </div>
        </template>

        <!-- Configurações -->
        <template v-else>
          <div class="panel">
            <h4>Aplicação</h4>
            <div class="kv-row"><span class="kv-label">Aparência</span><span>Roxo &amp; azul escuro</span></div>
            <div class="kv-row"><span class="kv-label">Idioma do app</span><span>Português</span></div>
          </div>
          <div class="panel">
            <h4>IA</h4>
            <div class="kv-row"><span class="kv-label">Preferências de geração</span><span class="tag">Ver aba Preferências</span></div>
          </div>
          <div class="panel">
            <h4>Dados</h4>
            <div class="kv-row"><span class="kv-label">Privacidade</span><span class="tag">Gerenciar</span></div>
            <div class="kv-row"><span class="kv-label">Gerenciamento da conta</span><span class="tag">Gerenciar</span></div>
          </div>
        </template>

      </div>
    </ion-content>
    <ion-toast :is-open="toastOpen" :message="toastText" :duration="2000" position="bottom" @didDismiss="toastOpen = false" />
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonSegment, IonSegmentButton, IonLabel,
  IonContent, IonButton, IonIcon, IonToggle, IonToast, IonInput,
} from '@ionic/vue';
import { createOutline, logOutOutline } from 'ionicons/icons';
import { account, aiProfile, prefs } from '@/composables/useMockData';
import { alternarSenha, atualizarPerfil, logout } from '@/service/AuthService';

import { auth } from '@/main';

const router = useRouter();
const tab = ref<'conta' | 'ia' | 'prefs' | 'config'>('conta');

const prefItems = [
  { key: 'respostasDiretas', label: 'Respostas diretas' },
  { key: 'usarExemplos', label: 'Usar exemplos' },
  { key: 'explicacoesDetalhadas', label: 'Explicações muito detalhadas' },
  { key: 'linguagemSimples', label: 'Utilizar linguagem simples' },
  { key: 'responderPortugues', label: 'Responder em português' },
];
const estrutura = ['Objetivo', 'Contexto', 'Instruções', 'Restrições', 'Formato'];
const nome = ref("")
const email = ref("")


const nomeNovo = ref("")
const senhaNovo = ref("")

const toastOpen = ref(false);
const toastText = ref('');
function toast(msg: string) { toastText.value = msg; toastOpen.value = true; }




async function salvarNome() {
  try {
    await atualizarPerfil(nomeNovo.value);
    nome.value = nomeNovo.value;
    alert("Nome atualizado!")
  } catch (e:any) {
    alert(e.message)
  }
}

async function salvarSenha() {
  try {
    await alternarSenha(senhaNovo.value);

    senhaNovo.value = "";
    alert("Senha atualizada com sucesso.")
  } catch(e:any) {
    alert(e.message)
  }
}

async function sair() {
  await logout();

  router.replace('/login')
}

onMounted(() => {
  const user = auth.currentUser;

  if(!user) return;

  nome.value = user.displayName || "";
  email.value = user.email || "";

  nomeNovo.value = nome.value;
})
</script>

<style scoped>
.pp-title { font-family: var(--pp-font-voice); font-weight: 500; }
.content-narrow { max-width: 680px; margin: 0 auto; }
.panel { background: var(--pp-surface); border: 1px solid var(--pp-border); border-radius: 14px; padding: 20px 22px; margin-bottom: 16px; }
.panel h4 { font-size: 12.5px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--pp-muted); margin: 0 0 12px; font-weight: 600; }
.row-between { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.who { display: flex; align-items: center; gap: 16px; }
.avatar-lg {
  width: 60px; height: 60px; border-radius: 50%; background: rgba(139, 108, 255, 0.16); color: var(--pp-lilac);
  display: flex; align-items: center; justify-content: center; font-size: 21px; font-weight: 600;
}
.acc-name { font-weight: 600; font-size: 16px; }
.tag { font-size: 12.5px; color: var(--pp-muted); }
.kv-row { display: flex; justify-content: space-between; align-items: center; padding: 13px 0; border-bottom: 1px solid var(--pp-border-soft); font-size: 14px; }
.kv-row:last-child { border-bottom: none; }
.kv-label { color: var(--pp-muted); }
.kv-wrap { text-align: right; max-width: 260px; }
.tech-list { display: flex; flex-wrap: wrap; gap: 8px; }
.pill {
  display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 12px;
  background: rgba(139, 108, 255, 0.16); color: var(--pp-lilac); border: 1px solid var(--pp-border);
}
.action-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 8px; }
.pref-row { padding: 11px 0; border-bottom: 1px solid var(--pp-border-soft); }
.pref-label { font-size: 14px; }
</style>

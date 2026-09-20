<template>
  <ion-page>
    <ion-content :fullscreen="true" class="screen-center">
      <div class="auth-card">
        <div class="auth-brand">
          <div class="mark">π</div>
          <div class="name">PromptPI</div>
        </div>
        <h1 class="auth-title">Crie sua conta</h1>
        <p class="auth-sub">Depois vamos te conhecer melhor para personalizar seus prompts.</p>

        <div class="auth-panel">
          <ion-item class="pp-item" lines="none">
            <ion-label position="stacked">Nome</ion-label>
            <ion-input v-model="nome" placeholder="Seu nome" />
          </ion-item>
          <ion-item class="pp-item" lines="none">
            <ion-label position="stacked">Email</ion-label>
            <ion-input v-model="email" type="email" placeholder="voce@email.com" />
          </ion-item>
          <ion-item class="pp-item" lines="none">
            <ion-label position="stacked">Senha</ion-label>
            <ion-input v-model="senha" type="password" placeholder="Crie uma senha" />
          </ion-item>
          <ion-item class="pp-item" lines="none" style="margin-bottom: 6px">
            <ion-label position="stacked">Confirmar senha</ion-label>
            <ion-input v-model="senha2" type="password" placeholder="Repita a senha" />
          </ion-item>

          <ion-button expand="block" color="primary" style="--border-radius: 10px; margin-top: 8px" @click="criar">
            Criar conta
          </ion-button>
        </div>

        <div class="auth-foot">
          Já tem uma conta?
          <span class="auth-link" @click="router.push('/login')">Entrar</span>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue';
import { cadastrar, atualizarPerfil } from '@/service/AuthService'

const router = useRouter();
const nome = ref('');
const email = ref('');
const senha = ref('');
const senha2 = ref('');

async function criar() {
  try {
    if(senha.value !== senha2.value){
      alert("Senha precisam serem iguais")
      return
    }

    await cadastrar(email.value, senha.value)
    await atualizarPerfil(nome.value)

    alert("Conta criada")
    router.push('/onboarding');
  } catch (error: any) {
    alert(error.message)
  }
}
</script>

<style scoped>
.screen-center {
  --background:
    radial-gradient(ellipse 900px 500px at 12% -8%, rgba(139, 108, 255, 0.22), transparent 60%),
    radial-gradient(ellipse 800px 600px at 105% 105%, rgba(62, 92, 231, 0.2), transparent 60%),
    var(--ion-background-color);
}
.auth-card { max-width: 400px; margin: 0 auto; padding: 48px 20px; }
.auth-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 36px; justify-content: center; }
.mark {
  width: 30px; height: 30px; border-radius: 8px;
  background: linear-gradient(160deg, var(--pp-primary), var(--pp-blue));
  display: flex; align-items: center; justify-content: center; color: #fff;
  font-family: var(--pp-font-voice); font-weight: 600; font-size: 16px;
}
.auth-brand .name { font-family: var(--pp-font-voice); font-size: 20px; font-weight: 500; }
.auth-title { font-family: var(--pp-font-voice); font-size: 26px; font-weight: 500; text-align: center; margin: 0 0 6px; }
.auth-sub { color: var(--pp-muted); font-size: 14px; text-align: center; margin: 0 0 30px; }
.auth-panel { background: var(--pp-surface); border: 1px solid var(--pp-border); border-radius: 14px; padding: 22px; }
.pp-item { --background: var(--ion-background-color); --border-radius: 10px; margin-bottom: 12px; --border-color: var(--pp-border); }
.auth-foot { text-align: center; font-size: 13.5px; color: var(--pp-muted); margin-top: 18px; }
.auth-link { color: var(--pp-lilac); cursor: pointer; font-weight: 500; }
.auth-link:hover { text-decoration: underline; }
</style>

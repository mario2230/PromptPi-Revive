<template>
  <ion-page>
    <ion-content :fullscreen="true" class="screen-center">
      <div class="splash-wrap">
        <div class="splash-mark">π</div>
        <div class="wordmark">PromptPI</div>
        <div class="splash-tag">Crie prompts que entendem você.</div>
        <div class="splash-bar"><div class="splash-bar-fill"></div></div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonContent } from '@ionic/vue';

const router = useRouter();

onMounted(() => {
  setTimeout(() => router.replace('/login'), 1300);
});
</script>

<style scoped>
.screen-center {
  --background:
    radial-gradient(ellipse 900px 500px at 12% -8%, rgba(139, 108, 255, 0.22), transparent 60%),
    radial-gradient(ellipse 800px 600px at 105% 105%, rgba(62, 92, 231, 0.2), transparent 60%),
    var(--ion-background-color);
}
.splash-wrap {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  text-align: center; width: 100%;
}
.splash-mark {
  width: 76px; height: 76px; border-radius: 20px;
  background: linear-gradient(160deg, var(--pp-primary), var(--pp-blue));
  display: flex; align-items: center; justify-content: center; color: #fff;
  font-family: var(--pp-font-voice); font-weight: 600; font-size: 34px;
  margin: 0 auto 22px;
}
.wordmark { font-family: var(--pp-font-voice); font-weight: 500; font-size: 26px; }
.splash-tag { color: var(--pp-muted); font-size: 15px; margin-top: 8px; }
.splash-bar { width: 160px; height: 3px; background: var(--pp-border); border-radius: 3px; margin: 34px auto 0; overflow: hidden; }
.splash-bar-fill {
  height: 100%; width: 0%; border-radius: 3px;
  background: linear-gradient(90deg, var(--pp-primary), var(--pp-blue));
  animation: fillbar 1.1s ease forwards;
}
@keyframes fillbar { to { width: 100%; } }
</style>

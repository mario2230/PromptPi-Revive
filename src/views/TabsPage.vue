<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="chat" href="/app/tabs/chat">
          <ion-icon aria-hidden="true" :icon="chatbubblesOutline" />
          <ion-label>Chat</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="prompts" href="/app/tabs/prompts">
          <ion-icon aria-hidden="true" :icon="documentsOutline" />
          <ion-label>Prompts</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="favoritos" href="/app/tabs/favoritos">
          <ion-icon aria-hidden="true" :icon="starOutline" />
          <ion-label>Favoritos</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="perfil" href="/app/tabs/perfil">
          <ion-icon aria-hidden="true" :icon="personCircleOutline" />
          <ion-label>Perfil</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { chatbubblesOutline, documentsOutline, starOutline, personCircleOutline } from 'ionicons/icons';
</script>

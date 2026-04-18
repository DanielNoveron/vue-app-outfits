<script setup>
import { ref } from "vue";
import Header from "./components/core/components/Header.vue";
const { snackbar } = useNotifier();
import { useTheme } from "vuetify";
import { useNotifier } from "./components/core/composables/UseNotifier";
import { useLoading } from "./components/core/composables/UseLoading";
const { isLoading } = useLoading()

const name = ref("Pedro Daniel");

const theme = useTheme();
theme.global.name.value = "dark";
</script>

<template>
  <v-app>
    <v-main>
      <Header />
      <router-view />
    </v-main>
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      top
      location="top"
      right
    >
      {{ snackbar.text }}
    </v-snackbar>
    <v-overlay :model-value="isLoading" class="d-flex align-center justify-center" persistent scrim="rgba(0, 0, 0, 0.4)">
      <v-progress-circular indeterminate color="white" size="64" />
    </v-overlay>
  </v-app>
</template>

<style></style>

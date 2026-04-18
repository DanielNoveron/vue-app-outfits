<script setup>
import { onMounted, ref } from "vue";

let isOpen = ref(false);

const props = defineProps({
  imageSrc: String,
});

onMounted(() => {
  isOpen.value = true;
});

function close() {
  isOpen.value = false;
  props.onClose?.("ok");
}
</script>
<template>
  <v-dialog v-model="isOpen" max-width="500px">
    <v-card>
      <v-card-title>Previsualización</v-card-title>
      <v-card-text class="d-flex justify-center">
        <img
          :src="imageSrc"
          alt="Preview"
          style="max-width: 100%; max-height: 600px"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="close()">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<style></style>

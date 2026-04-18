<script setup>
import { onMounted, ref } from "vue";

let isOpen = ref(false);

const props = defineProps({
  title: String,
  icon: String,
  colorIcon: String,
  message: String,
  showBtnCancel: Boolean,
  colorBtnCancel: String,
  showBtnConfirm: Boolean,
  colorBtnConfirm: String,
  labelBtnCancel: String,
  labelBtnConfirm: String,
  onClose: Function,
});

onMounted(() => {
  isOpen.value = true;
});

function confirm() {
  isOpen.value = false;
  props.onClose?.("ok");
}

function cancel() {
  isOpen.value = false;
  props.onClose?.("cancel");
}
</script>
<template>
  <v-dialog v-model="isOpen" width="400px">
    <div class="dialog">
      <div class="dialog-element">
        <div class="dialog-header">
          <v-icon class="icon" :color="colorIcon || 'orange-darken-1'">{{ icon }}</v-icon>
          <p class="message">{{ title || 'Acción' }}</p>
        </div>
        <div class="dialog-body">
          <p class="body">{{ message || '¿Estás seguro de proceder?'}}</p>
        </div>

        <div class="dialog-footer">
          <v-btn class="btn-action" @click="cancel"> {{ labelBtnCancel  || 'Cancelar'}} </v-btn>
          <v-btn class="btn-action" @click="confirm" :color="colorBtnConfirm || 'orange-darken-1'"> {{ labelBtnConfirm || 'Aceptar'}} </v-btn>
        </div>
      </div>
    </div>
  </v-dialog>
</template>
<style>
.dialog {
  width: 100%;
  height: max-content;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  background-color: #fff;
}

.dialog-element {
  margin: 40px;
}

.dialog-header {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  align-items: center;
  gap: 30px;
}

.icon {
  transform: scale(2.5);
}

.message {
  font-size: 25px;
  font-weight: bolder;
  text-transform: uppercase;
}

.body {
  font-size: 20px;
  margin-top: 15px;
}

.dialog-footer {
    display: flex;
    margin-top: 30px;
    flex-direction: row;
    gap: 5%;
    justify-content: space-between;
}

.btn-action {
    width: 47%;
}
</style>

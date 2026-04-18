<script setup>
import ClothingCard from "@/components/core/components/ClothingCard.vue";
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
  prendasSuperiores: Array,
  prendasInferiores: Array,
  prendasAccesorios: Array,
  prendasCalzado: Array,
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

function formatDate(fechaStr) {
  const date = new Date(fechaStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
</script>
<template>
  <v-dialog v-model="isOpen" width="400px">
    <div class="dialog">
      <div class="dialog-element">
        <div class="dialog-header">
          <v-icon class="icon" :color="colorIcon || 'orange-darken-1'">{{
            icon
          }}</v-icon>
          <p class="message">{{ title || "Acción" }}</p>
        </div>
        <div class="dialog-bodyyy">
          <div class="elementss">
            <h2>PRENDAS SUPERIORES</h2>
            <div class="claoth">
              <ClothingCard
                v-for="clothing in prendasSuperiores"
                :id="clothing.id"
                :name="clothing.nombre"
                :date-update="clothing.fechaActualizacion"
                :typeClothing="clothing.tipoPrenda"
                :dateCreate="formatDate(clothing.fechaCreacion)"
                :imageUrl="'/imagenes/' + clothing.imagen"
                :color="clothing.color"
                :show-btn-delete="false"
                :show-btn-edit="false"
                :show-date-create="false"
                :show-type-clothing="true"
                :show-date-update="true"
              />
            </div>
          </div>
          <div class="elementss">
            <h2>PRENDAS INFERIORES</h2>
            <div class="claoth">
              <ClothingCard
                v-for="clothing in prendasInferiores"
                :id="clothing.id"
                :name="clothing.nombre"
                :date-update="clothing.fechaActualizacion"
                :typeClothing="clothing.tipoPrenda"
                :dateCreate="formatDate(clothing.fechaCreacion)"
                :imageUrl="'/imagenes/' + clothing.imagen"
                :color="clothing.color"
                :show-btn-delete="false"
                :show-btn-edit="false"
                :show-date-create="false"
                :show-type-clothing="true"
                :show-date-update="true"
              />
            </div>
          </div>
          <div class="elementss">
            <h2>PRENDAS CALZADO</h2>
            <div class="claoth">
              <ClothingCard
                v-for="clothing in prendasCalzado"
                :id="clothing.id"
                :name="clothing.nombre"
                :date-update="clothing.fechaActualizacion"
                :typeClothing="clothing.tipoPrenda"
                :dateCreate="formatDate(clothing.fechaCreacion)"
                :imageUrl="'/imagenes/' + clothing.imagen"
                :color="clothing.color"
                :show-btn-delete="false"
                :show-btn-edit="false"
                :show-date-create="false"
                :show-type-clothing="true"
                :show-date-update="true"
              />
            </div>
          </div>
          <div class="elementss">
            <h2>PRENDAS ACCESORIOS</h2>
            <div class="claoth">
              <ClothingCard
                v-for="clothing in prendasAccesorios"
                :id="clothing.id"
                :name="clothing.nombre"
                :date-update="clothing.fechaActualizacion"
                :typeClothing="clothing.tipoPrenda"
                :dateCreate="formatDate(clothing.fechaCreacion)"
                :imageUrl="'/imagenes/' + clothing.imagen"
                :color="clothing.color"
                :show-btn-delete="false"
                :show-btn-edit="false"
                :show-date-create="false"
                :show-type-clothing="true"
                :show-date-update="true"
              />
            </div>
          </div>
        </div>

        <div class="dialog-footer">
          <v-btn class="btn-action" @click="cancel">
            {{ labelBtnCancel || "Cancelar" }}
          </v-btn>
          <v-btn
            v-if="showBtnConfirm"
            class="btn-action"
            @click="confirm"
            :color="colorBtnConfirm || 'orange-darken-1'"
          >
            {{ labelBtnConfirm || "Aceptar" }}
          </v-btn>
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
.elementss {
  display: flex;
  flex-direction: column !important;
  justify-content: flex-start !important;
  height: max-content !important;
  text-align: center;
}
.claoth {
    display: flex;
    flex-direction: row;
    gap: 30px;
  width: max-content !important;
}
.dialog-bodyyy {
  max-height: 500px;
  overflow-y: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  gap: 80px;
  row-gap: 40px;
  margin-top: 80px;
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

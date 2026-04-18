<script setup>
import { Clothing } from "@/components/core/classes/Clothing";
import PreviewImage from "@/components/core/components/PreviewImage.vue";
import ApiService from "@/components/core/services/ApiService";
import { DialogService } from "@/components/core/services/GenericDialog";
import { Constants } from "@/components/core/Utils/Constants";
import { ApiPaths } from "@/components/core/Utils/PathsApi";
import { validationsForm } from "@/components/core/Utils/ValidationsForm";
import { computed, onMounted, ref } from "vue";
import Filters from "./Filters.vue";
import ClothingCard from "@/components/core/components/ClothingCard.vue";

let isOpen = ref(false);
const valid = ref(false);

const nombreFilter = ref("");
const coloresFilter = ref([]);
const tipoPrendaFilter = ref([]);
const categoriaFilter = ref([]);
const fechaCreacionFilter = ref("");
const tiempoDia = ref([]);
const fechaActualizacionFilter = ref();
const clothingSelected = ref([]);

let clothingsList = ref();

const props = defineProps({
  title: String,
  icon: String,
  colorIcon: String,
  showBtnCancel: Boolean,
  colorBtnCancel: String,
  showBtnConfirm: Boolean,
  colorBtnConfirm: String,
  labelBtnCancel: String,
  labelBtnConfirm: String,
  typeClothing: String,
  onClose: Function,
});

onMounted(() => {
  isOpen.value = true;
  tipoPrendaFilter.value = [props.typeClothing];
  getAllClothings();
});

function confirm() {
  props.onClose?.({action: "ok", data: clothingSelected.value});
}

function cancel() {
  isOpen.value = false;
  props.onClose?.({action: "cancel", data: null});
}

function formatDate(fechaStr) {
  const date = new Date(fechaStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function callServiceFilter(e) {
  console.log(JSON.stringify(e.data));
  nombreFilter.value = e.data.filter;
  tipoPrendaFilter.value = [props.typeClothing];
  tiempoDia.value = e.data.timeDay;
  categoriaFilter.value = e.data.category;
  fechaActualizacionFilter.value = e.data.dateUpdate;
  fechaCreacionFilter.value = e.data.dateCreation;
  coloresFilter.value = e.data.colors;

  coloresFilter.value = e.data.colors.map((color) => color.split("-")[0]);

  getAllClothings();
}

async function getAllClothings() {
  const request = {
    page: 0,
    size: 10,
    filters: {
      nombre: nombreFilter.value,
      colores: coloresFilter.value,
      tipoPrenda: tipoPrendaFilter.value,
      fechaCreacion: fechaCreacionFilter.value,
    },
  };

  console.log(coloresFilter.value);
  console.log(tipoPrendaFilter.value);

  try {
    const response = await ApiService.post(
      ApiPaths.ClothingGetFilters,
      request
    );

    if (response.data.status == Constants.SUCCESS_RESPONSE_200) {
      clothingsList.value = response.data.data;
      clothingSelected.value = [];
      valid.value = clothingSelected.value.length > 0;
      console.log(JSON.stringify(clothingsList.value));
    }
  } catch (err) {
    console.log(err);
  }
}

function appendColor({
  id,
  name,
  dateUpdate,
  typeClothing,
  dateCreate,
  imageUrl,
  color,
}) {
  const clothing = {
    id,
    name,
    dateUpdate,
    typeClothing,
    dateCreate,
    imageUrl,
    color,
  };

  const index = clothingSelected.value.findIndex(c => c.id === clothing.id);

  // Si ya está seleccionada, quitarla
  if (index !== -1) {
    clothingSelected.value.splice(index, 1);

    const cloth = document.getElementsByClassName(`cloth-${id}`)[0];
    if (cloth) {
      cloth.classList.remove("activee");
    }

  } else {
    // Si es diferente a la única seleccionada actual, quitar la anterior
    if (clothingSelected.value.length > 0) {
      const previous = clothingSelected.value[0];
      const previousElement = document.getElementsByClassName(`cloth-${previous.id}`)[0];
      if (previousElement) {
        previousElement.classList.remove("activee");
      }
      clothingSelected.value.splice(0, 1);
    }

    // Agregar la nueva selección
    clothingSelected.value.push(clothing);
    const cloth = document.getElementsByClassName(`cloth-${id}`)[0];
    if (cloth) {
      cloth.classList.add("activee");
    }
  }

  // Validar si hay selección
  valid.value = clothingSelected.value.length > 0;
}

</script>
<template>
  <v-dialog v-model="isOpen" width="400px" scrim="true"  @after-leave="$emit('afterLeave')">
    <div class="dialog">
      <div class="dialog-element">
        <div class="dialog-header">
          <v-icon class="icon" :color="colorIcon || 'orange-darken-1'">{{
            icon
          }}</v-icon>
          <p class="message">{{ title || "Acción" }}</p>
        </div>
        <div class="dialog-body">
          <div class="columns">
            <Filters
              :show-colors="false"
              v-on:filterDone="callServiceFilter($event)"
              :show-outfits="false"
              :show-types-clothing="false"
            />
            <div class="clothings-search">
              <p
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  font-size: 40px;
                  font-weight: bold;
                  color: silver;
                "
                v-if="!clothingsList"
              >
                REALIZA UNA BUSQUEDA
              </p>
              <div class="elements" v-if="clothingsList?.content?.length > 0">
                <ClothingCard
                  @click="
                    appendColor({
                      id: clothing.id,
                      name: clothing.nombre,
                      dateUpdate: clothing.fechaActualizacion,
                      typeClothing: clothing.tipoPrenda,
                      dateCreate: formatDate(clothing.fechaCreacion),
                      imageUrl: '/imagenes/' + clothing.imagen,
                      color: clothing.color,
                    })
                  "
                  :class="'cloth-' + clothing.id"
                  v-for="clothing in clothingsList.content"
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
              <p
                v-if="
                  clothingsList &&
                  !(clothingsList.totalPages == clothingsList.currentPage + 1) &&  clothingsList.elementsPage > 0
                "
                class="view-more"
              >
                Ver más <v-icon>mdi-plus</v-icon>
              </p>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <v-btn class="btn-action" @click="cancel">
            {{ labelBtnCancel || "Cancelar" }}
          </v-btn>
          <v-btn
            class="btn-action"
            @click="confirm"
            :disabled="!valid"
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
}

.dialog-element {
  margin: 40px;
}
.view-more {
  text-align: center;
  margin-top: 40px;
  cursor: pointer;
  padding: 15px;
  transition: all 0.5s;
}
.view-more:hover {
  background-color: #b6b6b621;
  transition: all 0.5s;
}

.activee {
  border: 4px solid #42a5f5;
  border-radius: 20px;
  transition: box-shadow 0.3s ease;
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
.elements {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-height: 600px;
  height: 600px;
  overflow-y: auto;
  row-gap: 20px;
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
.columns {
  display: grid;
  grid-template-columns: 45% 50%;
  gap: 15px;
}
</style>

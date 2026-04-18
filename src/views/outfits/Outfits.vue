<script setup>
import { onMounted, ref } from "vue";
import Filters from "./components/Filters.vue";
import OutfitCard from "@/components/core/components/OutfitCard.vue";
import ClothingCard from "@/components/core/components/ClothingCard.vue";
import { DialogService } from "@/components/core/services/GenericDialog";
import DialogCreateEdit from "./components/DialogCreateEdit.vue";
import { ApiPaths } from "@/components/core/Utils/PathsApi";
import ApiService from "@/components/core/services/ApiService";
import { Constants } from "@/components/core/Utils/Constants";
import DialogCreateEditOutfit from "./components/DialogCreateEditOutfit.vue";

const showOutfits = ref(true);
const showClothing = ref(false);
let clothingsList = ref();
let outfitsList = ref([]);

const pageFilter = ref(0);
const sizeFilter = ref(10);
const nombreFilter = ref();
const coloresFilter = ref([]);
const tipoPrendaFilter = ref([]);
const fechaCreacionFilter = ref();
const fechaUltimoUsoFilter = ref();
const fechaActualizacionFilter = ref();
const categoriaFilter = ref([]);
const tiempoDia = ref([]);
const sizeOutfits = ref(10);
const sizeClothings = ref(10);

const totalClothings = ref(0);
const totalOutftis = ref(0);

onMounted(() => {
  getAllOutfits();
});

const today = new Date();
const formatted = today.toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function formatDate(fechaStr) {
  const date = new Date(fechaStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const ficticieDate = new Date();

// Restar 5 días
ficticieDate.setDate(today.getDate() - 5);

// Formatear la nueva fecha
const fictFormatted = ficticieDate.toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function openCreateClothing() {
  DialogService.open(DialogCreateEdit, {
    props: {
      title: "Nueva prenda",
      icon: "mdi-plus",
      colorIcon: "primary",
      showBtnCancel: true,
      showBtnConfirm: true,
      colorBtnConfirm: "primary",
      labelBtnCancel: "Cancelar",
      labelBtnConfirm: "Crear",
      width: "500px",
    },
  }).then((response) => {
    if (response === "ok") {
      getAllClothings();
    } else {
      console.log("Usuario canceló");
    }
  });
}

function openCreateOutfit() {
  DialogService.open(DialogCreateEditOutfit, {
    props: {
      title: "Nuevo Outfit",
      icon: "mdi-plus",
      colorIcon: "primary",
      showBtnCancel: true,
      showBtnConfirm: true,
      colorBtnConfirm: "primary",
      labelBtnCancel: "Cancelar",
      labelBtnConfirm: "Crear",
      width: "1500px",
      data: null,
    },
  }).then((response) => {
    if (response === "ok") {
      getAllOutfits();
    } else {
      console.log("Usuario canceló");
    }
  });
}

function releadClothings() {
  getAllClothings();
}

function releoadOutfits() {
  getAllOutfits();
}
async function getAllClothings() {
  const request = {
    page: 0,
    size: sizeClothings.value,
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
      totalClothings.value = response.data.data.totalElements;
      console.log(JSON.stringify(clothingsList));
    }
  } catch (err) {
    console.log(err);
  }
}

function showMoreClothing() {
  sizeClothings.value = sizeClothings.value + 10;
  getAllClothings();
}

async function getAllOutfits() {
  const request = {
    page: 0,
    size: 10,
    filters: {
      nombre: nombreFilter.value || null,
      colores: coloresFilter.value || [],
      tiempoDia: tiempoDia.value || [],
      categorias: categoriaFilter.value || [],
      fechaUltimoUso: fechaUltimoUsoFilter.value || null,
      fechaCreacion: fechaCreacionFilter.value || null,
    },
  };

  console.log(JSON.stringify(request));

  try {
    const response = await ApiService.post(ApiPaths.OutfitGetFilters, request);

    if (response.data.status == Constants.SUCCESS_RESPONSE_200) {
      outfitsList.value = response.data.data;
      totalOutftis.value = response.data.data.totalElements;
    }
  } catch (err) {
    console.log(err);
  }
}

function callServiceFilter(e) {
  console.log(JSON.stringify(e.data));
  nombreFilter.value = e.data.filter;
  tipoPrendaFilter.value = e.data.clothingTypes;
  tiempoDia.value = e.data.timeday;
  categoriaFilter.value = e.data.category;
  fechaActualizacionFilter.value = e.data.dateUpdate;
  fechaCreacionFilter.value = e.data.dateCreation;
  coloresFilter.value = e.data.colors;

  coloresFilter.value = e.data.colors.map((color) => color.split("-")[0]);

  if (showOutfits.value) {
    getAllOutfits();
  } else {
    getAllClothings();
  }
}
</script>
<template>
  <div class="container-router">
    <div class="container">
      <Filters
        v-on:filterDone="callServiceFilter"
        :show-outfits="showOutfits"
        :show-colors="true"
        :show-types-clothing="true"
      />
      <div class="cointainer-all">
        <div class="containerhome btns-show">
          <div
            :class="showOutfits ? 'show-btn active' : 'show-btn'"
            @click="
              getAllOutfits().then(() => {
                showOutfits = true;
                showClothing = false;
              })
            "
          >
            <p>VER OUTFITS</p>
          </div>
          <div
            :class="showClothing ? 'show-btn active' : 'show-btn'"
            @click="
              getAllClothings().then(() => {
                showOutfits = false;
                showClothing = true;
              })
            "
          >
            <p>VER PRENDAS</p>
          </div>
        </div>
        <div class="outfits-slide" v-if="showOutfits">
          <div class="containerhome">
            <div class="buttons-new">
              <v-btn
                prepend-icon="mdi-plus"
                @click="openCreateOutfit()"
                color="primary"
                >Nuevo</v-btn
              >
              <v-btn prepend-icon="mdi-calendar" color="secondary"
                >Agendar</v-btn
              >
            </div>
            <h2>TODO ({{ totalOutftis }})</h2>
            <div class="recent-outfits">
              <OutfitCard
                v-for="outfit in outfitsList?.content"
                :nombre="outfit.nombre"
                :id="outfit.id"
                :last-used="outfit.fechaUltimoUso"
                :dateCreate="formatDate(outfit.fechaCreacion)"
                :imageUrl="'/imagenes/' + outfit.imagen"
                :favorite="outfit.esFavorito"
                :color="outfit.color"
                :tiempoDia="outfit.tiempoDia"
                :categoria="outfit.categoria"
                @eliminadoRealizado="releoadOutfits()"
                @edicionRealizada="releoadOutfits()"
                :prendas-superiores="outfit.prendasSuperiores"
                :prendas-accesorios="outfit.prendasAccesorios"
                :prendas-inferiores="outfit.prendasInferiores"
                :prendas-calzado="outfit.prendasCalzado"
              />
            </div>
            <p
              v-if="
                !(outfitsList.totalPages == outfitsList.currentPage + 1) &&
                outfitsList.elementsPage > 0
              "
              class="view-more"
            >
              Ver más <v-icon>mdi-plus</v-icon>
            </p>
          </div>
        </div>
        <div class="clothing-slide" v-if="showClothing">
          <div class="containerhome">
            <div class="buttons-new">
              <v-btn
                prepend-icon="mdi-plus"
                color="primary"
                @click="openCreateClothing()"
                >Nuevo</v-btn
              >
            </div>
            <h2>PRENDAS ({{ totalClothings }})</h2>
            <div class="recent-outfits">
              <ClothingCard
                v-for="clothing in clothingsList.content"
                :id="clothing.id"
                :name="clothing.nombre"
                :date-update="clothing.fechaActualizacion"
                :typeClothing="clothing.tipoPrenda"
                :dateCreate="formatDate(clothing.fechaCreacion)"
                :imageUrl="'/imagenes/' + clothing.imagen"
                @eliminadoRealizado="releadClothings()"
                @edicionRealizada="releadClothings()"
                :color="clothing.color"
              />
            </div>
            <p
            @click="showMoreClothing()"
              v-if="
                !(clothingsList.totalPages == clothingsList.currentPage + 1) &&
                clothingsList.elementsPage > 0
              "
              class="view-more"
            >
              Ver más <v-icon>mdi-plus</v-icon>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  display: grid;
  grid-template-columns: 450px auto;
}
.buttons-new {
  margin-bottom: 40px;
  display: flex;
  justify-content: start;
  gap: 40px;
}
.containerhome {
  margin: 30px;
}
h2 {
  margin-bottom: 40px;
}
.recent-outfits {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
  row-gap: 50px;
}

.cointainer-all {
  display: flex;
  flex-direction: column;
  max-height: 85vh;
  overflow: auto;
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

.btns-show {
  display: flex;
  border-bottom: 4px solid rgb(72, 169, 166);
}

.show-btn {
  width: max-content;
  text-align: center;
  padding: 15px;
  font-size: 18px;
  font-weight: bold;
  border: 4px solid #b6b6b621;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  cursor: pointer;
}

.show-btn.active {
  background-color: rgb(72, 169, 166);
  color: #fff;
}
</style>

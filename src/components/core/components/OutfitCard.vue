<script setup>
import { ref } from "vue";
import { DialogService } from "../services/GenericDialog";
import GenericDialog from "./GenericDialog.vue";
import DialogCreateEdit from "@/views/outfits/components/DialogCreateEdit.vue";
import ApiService from "../services/ApiService";
import { ApiPaths } from "../Utils/PathsApi";
import { Constants } from "../Utils/Constants";
import DialogDetailClothingOutfit from "@/views/outfits/components/DialogDetailClothingOutfit.vue";
import PreviewImage from "./PreviewImage.vue";
import DialogCreateEditOutfit from "@/views/outfits/components/DialogCreateEditOutfit.vue";
import { Outfit } from "../classes/Outfit";
const zoom = ref(1);
const colors = Constants.COLORS;
const props = defineProps({
  id: String,
  nombre: String,
  imageUrl: String,
  lastUsed: String,
  dateCreate: String,
  favorite: Boolean,
  color: String,
  tiempoDia: String,
  categoria: String,
  prendasSuperiores: Array,
  prendasInferiores: Array,
  prendasAccesorios: Array,
  prendasCalzado: Array,
});

const emit = defineEmits(["eliminadoRealizado", "edicionRealizada"]);

const today = new Date();
const formatted = today.toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const localIsFavorite = ref(props.favorite);
const setFavorite = ref(
  localIsFavorite.value ? "mdi-heart" : "mdi-heart-outline"
);

function previewImage() {
  DialogService.open(PreviewImage, {
    props: {
      imageSrc: props.imageUrl,
    },
  }).then((response) => {
    if (response === "ok") {
    } else {
      console.log("Usuario canceló");
    }
  });
}
function setFavoriteColor() {
  localIsFavorite.value = !localIsFavorite.value;
  setFavorite.value = localIsFavorite.value ? "mdi-heart" : "mdi-heart-outline";
  setFavoriteCallService();
}

async function setFavoriteCallService() {
  const request = {
    id: props.id,
  };

  try {
    const response = await ApiService.post(ApiPaths.OutfitSetFavorite, request);

    if (response.data.status == Constants.SUCCESS_RESPONSE_200) {
      s;
    }
  } catch (err) {
    console.log(err);
  }
}

function editar() {
  const outfit = new Outfit(
    props.id,
    props.nombre,
    props.categoria,
    props.tiempoDia,
    props.dateCreate,
    props.color,
    props.imageUrl,
    props.lastUsed,
    props.prendasSuperiores,
    props.prendasInferiores,
    props.prendasAccesorios,
    props.prendasCalzado
  );

  DialogService.open(DialogCreateEditOutfit, {
    props: {
      title: "Editar Outfit",
      icon: "mdi-plus",
      colorIcon: "primary",
      showBtnCancel: true,
      showBtnConfirm: true,
      colorBtnConfirm: "primary",
      labelBtnCancel: "Cancelar",
      labelBtnConfirm: "Guardar",
      width: "1500px",
      data: outfit,
    },
  }).then((response) => {
    if (response === "ok") {
      emit("edicionRealizada", { mensaje: "OK" });
    } else {
      console.log("Usuario canceló");
    }
  });
}

function openDetailsClothings() {
  DialogService.open(DialogDetailClothingOutfit, {
    props: {
      title: "Detalle prendas",
      icon: "mdi-paperclip",
      colorIcon: "primary",
      message: null,
      showBtnCancel: true,
      showBtnConfirm: false,
      colorBtnConfirm: "",
      labelBtnCancel: "Cerrar",
      labelBtnConfirm: null,
      width: "1300px",
      prendasSuperiores: props.prendasSuperiores,
      prendasInferiores: props.prendasInferiores,
      prendasAccesorios: props.prendasAccesorios,
      prendasCalzado: props.prendasCalzado,
    },
  }).then((response) => {
    if (response === "ok") {
    } else {
      console.log("Usuario canceló");
    }
  });
}

async function deleteCallService() {
  const request = {
    id: props.id,
  };

  try {
    const response = await ApiService.post(ApiPaths.OutfitDelete, request);

    if (response.data.status == Constants.SUCCESS_RESPONSE_200) {
      emit("eliminadoRealizado", { mensaje: "OK" });
    }
  } catch (err) {
    console.log(err);
  }
}

function borrar() {
  DialogService.open(GenericDialog, {
    props: {
      title: "Borrar registro",
      icon: "mdi-delete",
      colorIcon: "error",
      message: "¿Estás seguro de borrar este OUTFIT?",
      showBtnCancel: true,
      showBtnConfirm: true,
      colorBtnConfirm: "error",
      labelBtnCancel: "Cancelar",
      labelBtnConfirm: "Borrar",
      width: "500px",
    },
  }).then((response) => {
    if (response === "ok") {
      deleteCallService();
    } else {
      console.log("Usuario canceló");
    }
  });
}
</script>
<template>
  <div class="card">
    <div class="use-today" v-if="formatted.includes(lastUsed)">
      <p>USANDO HOY</p>
    </div>
    <v-icon
      class="favorite"
      @click="setFavoriteColor"
      :style="{ color: localIsFavorite ? 'red' : 'silver' }"
      >{{ setFavorite }}</v-icon
    >
    <div class="img-outfit">
      <img
        :src="imageUrl"
        :style="{
          transform: `scale(${zoom})`,
          transition: 'transform 0.3s ease',
        }"
        alt="OUTFIT"
      />
      <div class="zoom-sec">
        <v-slider
          max="1"
          min="0.60"
          v-model="zoom"
          thumb-color="secondary"
          track-fill-color="b6b6b621"
          track-color="transparent"
          thumb-size="15px"
        ></v-slider>
      </div>
    </div>
    <div class="info-outfit">
      <p><b>Nombre:</b> {{ nombre || "Sin nombre" }}</p>
      <p><b>Último uso:</b> {{ lastUsed || "Aún sin usar" }}</p>
      <p v-if="dateCreate"><b>Fecha creación:</b> {{ dateCreate }}</p>
      <span @click="openDetailsClothings"
        ><v-icon>mdi-information</v-icon> Ver detalle
      </span>
      <div class="show-image-previeww" @click="previewImage()">
        <v-icon class="icon-show-image" color="black" style="cursor: pointer"
          >mdi-eye</v-icon
        >
        <v-tooltip location="end" persistent activator="parent">{{
          "Visualizar imagen"
        }}</v-tooltip>
      </div>
      <div class="div-colorr" :style="{ backgroundColor: color }">
          <v-tooltip location="end" persistent activator="parent">{{
            colors.find((c) => c.value === color)?.name || "Color desconocido"
          }}</v-tooltip>
        </div>
      <div class="buttons-actions">
        <v-btn size="small" @click="borrar()" prepend-icon="mdi-delete"
          >Borrar</v-btn
        >
        <v-btn size="small" @click="editar()" prepend-icon="mdi-pencil"
          >Editar</v-btn
        >
      </div>
    </div>
  </div>
</template>
<style>
.card {
  width: 250px;
  height: 400px;
  background-color: #b6b6b621;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  position: relative;
}
.use-today {
  position: absolute;
  top: -28px !important;
  left: 0px !important;
  z-index: 2;
  color: var(--color-blanco);
  padding: 4px;
  background-color: black;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.img-outfit {
  width: 100%;
  height: 300px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  position: relative;
}
.show-image-previeww {
  width: max-content;
  height: max-content;
  z-index: 3;
  padding: 5px;
  border-radius: 50%;
  background-color: #ffffffc5;
  position: absolute;
  top: 50px;
}
.div-colorr {
  width: 30px;
  height: 30px;
  border-radius: 50px;
  border: 2px solid #86868667;
  position: absolute;
  top: 10px;
  left: 0px;
}
.zoom-sec {
  position: absolute;
  left: 0;
  bottom: -30px;
  width: 100%;
}
.img-outfit img {
  width: 120%;
  height: 160%;
  object-fit: cover;
  transition: transform 0.4s ease;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
}

.info-outfit {
  display: flex;

  flex-direction: column;
  justify-content: center;
}

.info-outfit > * {
  margin-left: 10px;
  margin-right: 10px;
}

.info-outfit > *:last-child {
  margin-bottom: 20px;
}

.info-outfit > span {
  cursor: pointer;
  width: max-content;
  height: max-content;
  text-decoration: underline;
}

.lista-detalles {
  margin-left: 10px;
}

.buttons-actions {
  display: flex;
  flex-direction: row-reverse;
  gap: 10px;
  justify-content: space-between;
}

.favorite {
  position: absolute !important;
  border-radius: 50%;
  top: 10px !important;
  right: 10px !important;
  transform: scale(1.5);
  z-index: 2;
}
</style>

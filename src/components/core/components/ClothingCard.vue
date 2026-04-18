<script setup>
import { ref } from "vue";
import { DialogService } from "../services/GenericDialog";
import GenericDialog from "./GenericDialog.vue";
import DialogCreateEdit from "@/views/outfits/components/DialogCreateEdit.vue";
import ApiService from "../services/ApiService";
import { ApiPaths } from "../Utils/PathsApi";
import { Constants } from "../Utils/Constants";
import { Clothing } from "../classes/Clothing";
import PreviewImage from "./PreviewImage.vue";
const zoom = ref(1);
const props = defineProps({
  id: String,
  name: String,
  imageUrl: String,
  dateUpdate: String,
  typeClothing: String,
  dateCreate: String,
  color: String,
  showBtnEdit: {
    type: Boolean,
    default: true
  },
  showBtnDelete: {
    type: Boolean,
    default: true
  },
  showTypeClothing: {
    type: Boolean,
    default: true
  },
  showDateUpdate: {
    type: Boolean,
    default: true
  },
  showDateCreate: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(["eliminadoRealizado", "edicionRealizada"]);


function borrar() {
  DialogService.open(GenericDialog, {
    props: {
      title: "Borrar registro",
      icon: "mdi-delete",
      colorIcon: "error",
      message: `¿Estás seguro de borrar esta prenda con nombre: ${props.name}?`,
      showBtnCancel: true,
      showBtnConfirm: true,
      colorBtnConfirm: "error",
      labelBtnCancel: "Cancelar",
      labelBtnConfirm: "Borrar",
      width: "500px",
    },
  }).then((response) => {
    if (response === "ok") {
      deleteClothing();
    } else {
      console.log("Usuario canceló");
    }
  });
}

const colors = Constants.COLORS;

function openEditClothing() {
  const nombreImagen = props.imageUrl.split('/').pop();
  const dataEdit = new Clothing(props.id, props.name, props.typeClothing, props.dateCreate, props.color, nombreImagen, props.dateUpdate);
  console.log(JSON.stringify(dataEdit));
  DialogService.open(DialogCreateEdit, {
    props: {
      title: "Editar prenda",
      icon: "mdi-pencil",
      colorIcon: "secondary",
      showBtnCancel: true,
      showBtnConfirm: true,
      colorBtnConfirm: "secondary",
      labelBtnCancel: "Cancelar",
      labelBtnConfirm: "Guardar",
      width: "500px",
      data: dataEdit
    },
  }).then((response) => {
    if (response === "ok") {
      emit("edicionRealizada", { mensaje: "OK" });
    } else {
      console.log("Usuario canceló");
    }
  });
}

function previewImage() {
  DialogService.open(PreviewImage, {
    props: {
      imageSrc: props.imageUrl
    },
  }).then((response) => {
    if (response === "ok") {
    } else {
      console.log("Usuario canceló");
    }
  });
}

async function deleteClothing() {
  const request = {
    id: props.id,
  };

  try {
    const response = await ApiService.post(ApiPaths.ClothingDelete, request);

    if (response.data.status == Constants.SUCCESS_RESPONSE_200) {
      console.log(response.data);
      emit("eliminadoRealizado", { mensaje: "OK" });
    }
  } catch (err) {
    console.log(err);
  }
}
</script>
<template>
  <div class="card">
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
      <p class="name-clothing">{{ name }}</p>
      <p class="name-clothing" v-if="showTypeClothing">{{ typeClothing }}</p>
      <p v-if="dateCreate && showDateCreate" class="ft-size-small">
        <b>Creación:</b> {{ dateCreate }}
      </p>
      <p v-if="dateCreate && showDateUpdate" class="ft-size-small">
        <b>Última actualización:</b> {{ dateCreate }}
      </p>
      <div class="div-color" :style="{ backgroundColor: color }">
        <v-tooltip location="end" persistent activator="parent">{{
          colors.find((c) => c.value === color)?.name || "Color desconocido"
        }}</v-tooltip>
      </div>
     
      <div class="show-image-preview" @click="previewImage()">
        <v-icon class="icon-show-image" color="black" style="cursor: pointer">mdi-eye</v-icon>
         <v-tooltip location="end" persistent activator="parent">{{
          "Visualizar imagen"
        }}</v-tooltip>
      </div>

      <div class="buttons-actions">
        <v-btn  v-if="showBtnDelete" size="small" @click="borrar()" prepend-icon="mdi-delete"
          >Borrar</v-btn
        >
        <v-btn
        v-if="showBtnEdit"
          size="small"
          prepend-icon="mdi-pencil"
          @click="openEditClothing()"
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
.zoom-sec {
  position: absolute;
  left: 0;
  bottom: -30px;
  width: 100%;
}
.name-clothing {
  font-weight: bold;
  text-transform: uppercase;
}
.img-outfit img {
  width: 120%;
  height: 160%;
  object-fit: cover;
  transition: transform 0.4s ease;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
}
.div-color {
  width: 30px;
  height: 30px;
  border-radius: 50px;
  border: 2px solid #86868667;
  position: absolute;
  top: 10px;
}
.show-image-preview {
  width: max-content;
  height: max-content;
  z-index: 3;
  padding: 5px;
  border-radius: 50%;
  background-color: #ffffffc5;
   position: absolute;
  top: 50px;
}


.info-outfit {
  display: flex;

  flex-direction: column;
  justify-content: center;
}

.info-outfit {
  padding-top: 20px;
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
  margin-top: 20px;
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

<script setup>
import { Clothing } from "@/components/core/classes/Clothing";
import PreviewImage from "@/components/core/components/PreviewImage.vue";
import ApiService from "@/components/core/services/ApiService";
import { DialogService } from "@/components/core/services/GenericDialog";
import { Constants } from "@/components/core/Utils/Constants";
import { ApiPaths } from "@/components/core/Utils/PathsApi";
import { validationsForm } from "@/components/core/Utils/ValidationsForm";
import { computed, onMounted, ref } from "vue";

let isOpen = ref(false);
// Declaración para formulario
const formRef = ref();
let isEdit = ref(false);
const showFileInput = ref(false);
const valid = ref(false);
const nombre = ref();
const color = ref();
const imagen = ref();
const showPreview = ref(false);
const imageUrl = ref(null);
const tipoPrenda = ref();
const nombreValidaciones = [
  ...validationsForm.required("Nombre"),
  ...validationsForm.maxLength(100, "Nombre"),
];
const colorValidacioness = [...validationsForm.required("Color")];
const imagenValidaciones = [
  ...validationsForm.required("Imagen"),
  ...validationsForm.fileSize(5 * 1024 * 1024, "La imagen"),
  ...validationsForm.fileTypes(["jpg", "jpeg", "png", "webp"], "La imagen"),
];
const tipoPrendaValidaciones = [...validationsForm.required("Tipo prenda")];

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
  onClose: Function,
  data: Clothing,
});

onMounted(() => {
  isOpen.value = true;
});

function confirm() {
  createEditClothing();
}

function cancel() {
  isOpen.value = false;
  props.onClose?.("cancel");
}

function activarCambioImagen() {
  showFileInput.value = !showFileInput.value;
  imagen.value = null;
}

const imagenSeleccionada = computed(() => {
  // Si hay imagen nueva seleccionada por el usuario (como File o File[])
  if (imagen.value) {
    const file = Array.isArray(imagen.value) ? imagen.value[0] : imagen.value;
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
  }

  // Si estás en edición y ya tienes una imagen previa
  if (props.data?.imagen) {
    return `/imagenes/${props.data.imagen}`;
  }
});

function onInit() {
  if (props.title.toLocaleUpperCase().includes("EDITAR")) {
    showFileInput.value = false;
    imagenSeleccionada.value = "/imagenes/" + props.data.imagen;
    isEdit.value = true;
    nombre.value = props.data.nombre;
    color.value = Constants.COLORS.find((c) => c.value === props.data.color);
    tipoPrenda.value = props.data.tipoPrenda;
    imagen.value = props.data.imagen;
    imageUrl.value = props.data.imagen;
  } else {
    showFileInput.value = true;
  }
}

// Abrir preview
function togglePreview() {
 if (imagenSeleccionada.value) {
    showPreview.value = !showPreview.value;
  }
 previewImage();
}

function previewImage() {
  DialogService.open(PreviewImage, {
    props: {
      imageSrc: imagenSeleccionada.value
    },
  }).then((response) => {
    if (response === "ok") {
    } else {
      console.log("Usuario canceló");
    }
  });
}

async function createEditClothing() {
  const formData = new FormData();

  if (props.data) {
    formData.append("id", props.data.id);
  }

  formData.append("nombre", nombre.value);
  formData.append("tipoPrenda", tipoPrenda.value);
  formData.append("color", color.value.value);

  if (showFileInput.value === true) {
    formData.append("imagen", imagen.value);
  }

  if (props.data) {
    try {
      const response = await ApiService.post(
        ApiPaths.ClothingUpdate,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.status == Constants.SUCCESS_RESPONSE_200) {
        isOpen.value = false;
        props.onClose?.("ok");
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    try {
      const response = await ApiService.post(
        ApiPaths.ClothingCreate,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.status == Constants.SUCCESS_RESPONSE_200) {
        isOpen.value = false;
        props.onClose?.("ok");
      }
    } catch (err) {
      console.log(err);
    }
  }
}

const colors = Constants.COLORS;

const clothingType = Constants.CLOTHING_TYPES;

onInit();
</script>
<template>
  <v-dialog v-model="isOpen" width="400px"  @after-leave="$emit('afterLeave')">
    <div class="dialog">
      <div class="dialog-element">
        <div class="dialog-header">
          <v-icon class="icon" :color="colorIcon || 'orange-darken-1'">{{
            icon
          }}</v-icon>
          <p class="message">{{ title || "Acción" }}</p>
        </div>
        <div class="dialog-body">
          <v-form v-model="valid" class="form" ref="formRef">
            <div class="inputs">
              <v-text-field
                variant="outlined"
                v-model="nombre"
                :counter="100"
                :rules="nombreValidaciones"
                label="Nombre"
                required
              ></v-text-field>
              <v-select
                v-model="color"
                :rules="colorValidacioness"
                :items="colors"
                item-title="name"
                item-value="value"
                label="Color"
                variant="outlined"
                :return-object="true"
              >
                <template #item="{ item, props }">
                  <v-list-item v-bind="props">
                    <template #prepend>
                      <div
                        :style="{
                          backgroundColor: item.value,
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          border: '1px solid #ccc',
                          marginRight: '10px',
                        }"
                      ></div>
                    </template>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                  </v-list-item>
                </template>

                <template #selection="{ item }">
                  <div
                    v-if="item"
                    style="display: flex; align-items: center; gap: 8px"
                  >
                    <div
                      :style="{
                        backgroundColor: item.value,
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        border: '1px solid #ccc',
                      }"
                    ></div>
                    <span>{{ item.title }}</span>
                  </div>
                </template>
              </v-select>
              <div
                style="display: flex; align-items: center"
                v-if="!showFileInput"
              >
                <v-text-field
                  label="Imagen actual"
                  v-model="props.data.imagen"
                  disabled
                ></v-text-field>
                <v-icon @click="togglePreview()" style="cursor: pointer"
                  >mdi-eye</v-icon
                >
              </div>

              <v-btn color="green" v-if="isEdit" @click="activarCambioImagen()">{{
                showFileInput ? "Regresar imagen" : "Cambiar imagen"
              }}</v-btn>
              <v-file-input
                v-if="showFileInput"
                label="Imagen"
                counter
                variant="outlined"
                v-model="imagen"
                :rules="imagenValidaciones"
                show-size
                :append-icon="''"
                accept=".jpg, .jpeg, .png, .webp"
              >
                <template #append-inner>
                  <div
                    v-if="imagenSeleccionada"
                    style="
                      pointer-events: auto;
                      display: flex;
                      align-items: center;
                    "
                    @click.stop.prevent="togglePreview"
                    title="Ver imagen"
                  >
                    <v-icon style="cursor: pointer">mdi-eye</v-icon>
                  </div>
                </template>
              </v-file-input>
              <v-select
                v-model="tipoPrenda"
                :items="clothingType"
                :rules="tipoPrendaValidaciones"
                label="Tipo prenda"
                variant="outlined"
              ></v-select>
            </div>
          </v-form>
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

.form {
  margin-top: 30px;
}

.inputs {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
}
</style>

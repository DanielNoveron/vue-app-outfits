<script setup>
import { Clothing } from "@/components/core/classes/Clothing";
import PreviewImage from "@/components/core/components/PreviewImage.vue";
import ApiService from "@/components/core/services/ApiService";
import { DialogService } from "@/components/core/services/GenericDialog";
import { Constants } from "@/components/core/Utils/Constants";
import { ApiPaths } from "@/components/core/Utils/PathsApi";
import { validationsForm } from "@/components/core/Utils/ValidationsForm";
import { computed, onMounted, ref } from "vue";
import DialogSearchClothing from "./DialogSearchClothing.vue";
import ClothingCard from "@/components/core/components/ClothingCard.vue";
import { Outfit } from "@/components/core/classes/Outfit";
import { useNotifier } from "@/components/core/composables/UseNotifier";
const { notify } = useNotifier();

let isOpen = ref(false);
// Declaración para formulario
const formRef = ref();
let isEdit = ref(false);
const showFileInput = ref(false);
const valid = ref(false);
const nombre = ref();
const color = ref();
const imagen = ref();
const categoria = ref();
const tiempoDia = ref();
const prendasSuperiores = ref([]);
const prendasInferiores = ref([]);
const prendasCalzado = ref([]);
const prendasAccesorios = ref([]);
const showPreview = ref(false);
const imageUrl = ref(null);
const dayTimesItems = ref(Constants.TIME_DAY);
const categoriesItems = ref(Constants.CATEGORIES);
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
const categoriaValidaciones = [...validationsForm.required("Categoria")];
const tiempoDiaValidaciones = [...validationsForm.required("Tiempo día")];

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
  data: Outfit,
});

onMounted(() => {
  isOpen.value = true;
});

function confirm() {
  createEditOutfit();
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
    return props.data.imagen;
  }
});

function onInit() {
  if (props.title.toLocaleUpperCase().includes("EDITAR")) {
    console.log(JSON.stringify(props.data));
    showFileInput.value = false;
    const nameFile = props.data.imagen
      .replace(/\\/g, "/")
      .split("/")
      .filter(Boolean)
      .pop();

    imagenSeleccionada.value = nameFile;
    console.log("imagen: " + imagenSeleccionada.value);
    isEdit.value = true;
    nombre.value = props.data.nombre;
    color.value = Constants.COLORS.find((c) => c.value === props.data.color);
    imagen.value = props.data.imagen;
    imageUrl.value = props.data.imagen;
    tiempoDia.value = props.data.tiempoDia;
    categoria.value = props.data.categoria;

    const pI = props.data.listaPrendasInferiores;
    fillCLothingsEditAction(pI, prendasInferiores);

    const pA = props.data.listaPrendasAccesorios;
    fillCLothingsEditAction(pA, prendasAccesorios);

    const pC = props.data.listaPrendasCalzado;
    fillCLothingsEditAction(pC, prendasCalzado);

    const pS = props.data.listaPrendasSupreriores;
    fillCLothingsEditAction(pS, prendasSuperiores);
  } else {
    showFileInput.value = true;
  }
}

function fillCLothingsEditAction(list, listPush) {
  for (let p of list) {
    const clothing = {
      id: p.id,
      name: p.nombre,
      dateUpdate: p.fechaActualizacion,
      typeClothing: p.tipoPrenda,
      dateCreate: p.fechaCreacion,
      imageUrl: "/imagenes/" + p.imagen,
      color: p.color,
    };
    listPush.value.push(clothing);
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
      imageSrc: imagenSeleccionada.value,
    },
  }).then((response) => {
    if (response === "ok") {
    } else {
      console.log("Usuario canceló");
    }
  });
}

async function createEditOutfit() {
  const formData = new FormData();

  if (props.data) {
    formData.append("id", props.data.id);
  }

  formData.append("nombre", nombre.value);
  formData.append("color", color.value.value);
  formData.append("categoria", categoria.value);
  formData.append("tiempoDia", tiempoDia.value);

  if (showFileInput.value === true) {
    formData.append("imagen", imagen.value);
  }

  // PRENDAS INFERIORES
  let lpf = [];
  prendasInferiores.value.forEach((element) => {
    lpf.push(element.id);
  });

  // PRENDAS SUPERIORES
  let lps = [];
  prendasSuperiores.value.forEach((element) => {
    lps.push(element.id);
  });

  // PRENDAS ACCESORIOS
  let lpa = [];
  prendasAccesorios.value.forEach((element) => {
    lpa.push(element.id);
  });

  // PRENDAS CALZADO
  let lpc = [];
  prendasCalzado.value.forEach((element) => {
    lpc.push(element.id);
  });

  formData.append("prendasSuperiores", lps);
  formData.append("prendasInferiores", lpf);
  formData.append("prendasCalzado", lpc);
  formData.append("prendasAccesorios", lpa);

  if (props.data) {
    try {
      const response = await ApiService.post(ApiPaths.OutfitUpdate, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status == Constants.SUCCESS_RESPONSE_200) {
        isOpen.value = false;
        props.onClose?.("ok");
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    try {
      const response = await ApiService.post(ApiPaths.OutfitSave, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status == Constants.SUCCESS_RESPONSE_200) {
        isOpen.value = false;
        props.onClose?.("ok");
      }
    } catch (err) {
      console.log(err);
    }
  }
}

function openSearchClothing(type) {
  DialogService.open(DialogSearchClothing, {
    props: {
      title: "Buscar prenda",
      icon: "mdi-magnify",
      colorIcon: "primary",
      showBtnCancel: true,
      showBtnConfirm: true,
      colorBtnConfirm: "primary",
      labelBtnCancel: "Cancelar",
      labelBtnConfirm: "Seleccionar",
      typeClothing: type,
      width: "1200px",
    },
  }).then((response) => {
    if (response.action === "ok") {
      let isExist;
      switch (type) {
        case Constants.CLOTHING_TYPES[0]: // SUPERIOR
          isExist = existClothingInList(
            response.data[0],
            prendasSuperiores.value
          );
          if (isExist) {
            return;
          }
          prendasSuperiores.value.push(response.data[0]);
          break;
        case Constants.CLOTHING_TYPES[1]: // INFERIOR
          isExist = existClothingInList(
            response.data[0],
            prendasInferiores.value
          );
          if (isExist) {
            return;
          }
          prendasInferiores.value.push(response.data[0]);
          break;
        case Constants.CLOTHING_TYPES[2]: // ACCESORIO
          isExist = existClothingInList(
            response.data[0],
            prendasAccesorios.value
          );
          if (isExist) {
            return;
          }
          prendasAccesorios.value.push(response.data[0]);
          break;
        case Constants.CLOTHING_TYPES[3]: // CALZADO
          isExist = existClothingInList(response.data[0], prendasCalzado.value);
          if (isExist) {
            return;
          }
          prendasCalzado.value.push(response.data[0]);
          break;
      }
    } else {
      console.log("Usuario canceló");
    }
  });
}

function existClothingInList(clothingAdd, listValid) {
  const index = listValid.findIndex((c) => c.id === clothingAdd.id);
  if (index !== -1) {
    notify("Ya existe en la lista", "warning");
    return true;
  }
  return false;
}

function removeItem(type, id) {
  let index = -1;
  switch (type) {
    case Constants.CLOTHING_TYPES[0]: // SUPERIOR
      index = prendasSuperiores.value.findIndex((p) => p.id === id);
      if (index !== -1) prendasSuperiores.value.splice(index, 1);
      break;
    case Constants.CLOTHING_TYPES[1]: // INFERIOR
      index = prendasInferiores.value.findIndex((p) => p.id === id);
      if (index !== -1) prendasInferiores.value.splice(index, 1);
      break;
    case Constants.CLOTHING_TYPES[2]: // ACCESORIO
      index = prendasAccesorios.value.findIndex((p) => p.id === id);
      if (index !== -1) prendasAccesorios.value.splice(index, 1);
      break;
    case Constants.CLOTHING_TYPES[3]: // CALZADO
      index = prendasCalzado.value.findIndex((p) => p.id === id);
      if (index !== -1) prendasCalzado.value.splice(index, 1);
      break;
  }
}

const colors = Constants.COLORS;

onInit();
</script>
<template>
  <v-dialog
    v-model="isOpen"
    width="400px"
    scrim
    @after-leave="$emit('afterLeave')"
  >
    <div class="dialog">
      <div class="dialog-element">
        <div class="dialog-header">
          <v-icon class="icon" :color="colorIcon || 'orange-darken-1'">{{
            icon
          }}</v-icon>
          <p class="message">{{ title || "Acción" }}</p>
        </div>
        <div class="dialog-bodyy">
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
                label="Color principal"
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
              <v-select
                label="Categoria"
                v-model="categoria"
                :rules="categoriaValidaciones"
                :items="categoriesItems"
                variant="outlined"
              ></v-select>
              <v-select
                v-model="tiempoDia"
                label="Tiempo día"
                :rules="tiempoDiaValidaciones"
                :items="dayTimesItems"
                variant="outlined"
              ></v-select>
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

              <v-btn
                color="green"
                v-if="isEdit"
                @click="activarCambioImagen()"
                >{{
                  showFileInput ? "Regresar imagen" : "Cambiar imagen"
                }}</v-btn
              >
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
            </div>
          </v-form>
          <div class="sections-add__clothing">
            <h2>PRENDAS</h2>
            <div class="section section-superior">
              <p>
                SUPERIOR
                <small
                  v-if="prendasSuperiores.length == 0"
                  style="color: #b71c1c"
                  >Mínimo una</small
                >
              </p>
              <div class="elementos">
                <div class="cloo" v-for="ps in prendasSuperiores">
                  <v-icon
                    class="remove-item"
                    color="white"
                    @click="removeItem(Constants.CLOTHING_TYPES[0], ps.id)"
                    style="cursor: pointer"
                    >mdi-close</v-icon
                  >
                  <ClothingCard
                    :color="ps.color"
                    :show-btn-delete="false"
                    :show-btn-edit="false"
                    :date-create="ps.dateCreate"
                    :id="ps.id"
                    :type-clothing="ps.typeClothing"
                    :image-url="ps.imageUrl"
                    :name="ps.name"
                    :show-date-create="false"
                    :show-date-update="false"
                  />
                </div>
              </div>

              <div
                @click="openSearchClothing(Constants.CLOTHING_TYPES[0])"
                class="add-clothing"
              >
                <v-icon icon="mdi-plus"></v-icon>
                <p>Agregar</p>
              </div>
            </div>
            <div class="section section-inferior">
              <p>
                INFERIOR
                <small
                  v-if="prendasInferiores.length == 0"
                  style="color: #b71c1c"
                  >Mínimo una</small
                >
              </p>
              <div class="elementos">
                <div class="cloo" v-for="ps in prendasInferiores">
                  <v-icon
                    class="remove-item"
                    color="white"
                    @click="removeItem(Constants.CLOTHING_TYPES[1], ps.id)"
                    style="cursor: pointer"
                    >mdi-close</v-icon
                  >
                  <ClothingCard
                    :color="ps.color"
                    :show-btn-delete="false"
                    :show-btn-edit="false"
                    :date-create="ps.dateCreate"
                    :id="ps.id"
                    :type-clothing="ps.typeClothing"
                    :image-url="ps.imageUrl"
                    :name="ps.name"
                    :show-date-create="false"
                    :show-date-update="false"
                  />
                </div>
              </div>
              <div
                @click="openSearchClothing(Constants.CLOTHING_TYPES[1])"
                class="add-clothing"
              >
                <v-icon icon="mdi-plus"></v-icon>
                <p>Agregar</p>
              </div>
            </div>
            <div class="section section-inferior">
              <p>
                CALZADO
                <small v-if="prendasCalzado.length == 0" style="color: #b71c1c"
                  >Mínimo uno</small
                >
              </p>
              <div class="elementos">
                <div class="cloo" v-for="ps in prendasCalzado">
                  <v-icon
                    class="remove-item"
                    color="white"
                    @click="removeItem(Constants.CLOTHING_TYPES[3], ps.id)"
                    style="cursor: pointer"
                    >mdi-close</v-icon
                  >
                  <ClothingCard
                    :color="ps.color"
                    :show-btn-delete="false"
                    :show-btn-edit="false"
                    :date-create="ps.dateCreate"
                    :id="ps.id"
                    :type-clothing="ps.typeClothing"
                    :image-url="ps.imageUrl"
                    :name="ps.name"
                    :show-date-create="false"
                    :show-date-update="false"
                  />
                </div>
              </div>
              <div
                @click="openSearchClothing(Constants.CLOTHING_TYPES[3])"
                class="add-clothing"
              >
                <v-icon icon="mdi-plus"></v-icon>
                <p>Agregar</p>
              </div>
            </div>
            <div class="section section-inferior">
              <p>
                ACCESORIO
                <small
                  v-if="prendasAccesorios.length === 0"
                  style="color: #b71c1c"
                  >Mínimo uno</small
                >
              </p>
              <div class="elementos">
                <div class="cloo" v-for="ps in prendasAccesorios">
                  <v-icon
                    class="remove-item"
                    color="white"
                    @click="removeItem(Constants.CLOTHING_TYPES[2], ps.id)"
                    style="cursor: pointer"
                    >mdi-close</v-icon
                  >
                  <ClothingCard
                    :color="ps.color"
                    :show-btn-delete="false"
                    :show-btn-edit="false"
                    :date-create="ps.dateCreate"
                    :id="ps.id"
                    :type-clothing="ps.typeClothing"
                    :image-url="ps.imageUrl"
                    :name="ps.name"
                    :show-date-create="false"
                    :show-date-update="false"
                  />
                </div>
              </div>
              <div
                @click="openSearchClothing(Constants.CLOTHING_TYPES[2])"
                class="add-clothing"
              >
                <v-icon icon="mdi-plus"></v-icon>
                <p>Agregar</p>
              </div>
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
            :disabled="
              !valid ||
              prendasSuperiores.length == 0 ||
              prendasAccesorios.length == 0 ||
              prendasInferiores.length == 0 ||
              prendasCalzado.length == 0
            "
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
.sections-add__clothing {
  max-height: 600px;
  overflow-y: auto;
}
.cloo {
  width: max-content;
  position: relative;
}
.remove-item {
  width: 15px;
  height: 15px;
  position: absolute;
  top: -20px;
  right: -20px;
  background-color: red;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
  padding: 20px;
  border-radius: 50%;
}
.elementos {
  height: max-content;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 30px;
  row-gap: 20px;
}
.section {
  margin-top: 20px;
}
.add-clothing {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: center;
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.034);
  margin-top: 15px;
  cursor: pointer;
}

.add-clothing:hover {
  background-color: rgba(0, 0, 0, 0.144);
}
.dialog-bodyy {
  display: grid;
  grid-template-columns: 30% auto;
  gap: 20px;
}

.dialog-body .dialog-element {
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

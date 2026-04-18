<script setup>
import { Constants } from "@/components/core/Utils/Constants";
import { ref, computed, watch } from "vue";

const props = defineProps({
  showOutfits: Boolean,
  showColors: Boolean,
  showTypesClothing: Boolean,
});
const emit = defineEmits(["filterDone"]);

const categoriesSelected = ref([]);
const clothingTypesSelected = ref([]);
const dayTimes = ref([]);
const colorsFilters = ref([]);
const clothingTypes = ref(Constants.CLOTHING_TYPES);
const dayTimesItems = ref(Constants.TIME_DAY);
const categoriesItems = ref(Constants.CATEGORIES);
const clothingTypesfilter = ref([]);

const filtersData = ref({
  filter: "",
  clothingTypes: [],
  category: [],
  timeday: [],
  colors: [],
  dateCreation: "",
  dateUpdate: "",
});

const menu = ref(false);
const menu2 = ref(false);
const selectedDate = ref(""); // formato yyyy-mm-dd
const dateUse = ref("");

const filterInput = ref();

watch(
  () => props.showOutfits,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      limpiarFiltros();
    }
  }
);

// Vigilar showColors
watch(
  () => props.showColors,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      limpiarFiltros();
    }
  }
);

function limpiarFiltros() {
  filterInput.value = '';
  clothingTypesfilter.value = [];
  categoriesSelected.value = [];
  clothingTypesSelected.value = [];
  dayTimes.value = [];
  colorsFilters.value = [];
  console.log("Filtros limpiados por cambio de props");
  dateUse.value = null;
  selectedDate.value = null;

   filtersData.value = {
    filter: "",
    clothingTypes: [],
    category: [],
    timeday: [],
    colors: [],
    dateCreation: "",
    dateUpdate: "",
  };

   document.querySelectorAll(".color.active").forEach(el => {
    el.classList.remove("active");
  });

  emit("filterDone", { data: filtersData.value });

}

function validateSelection(category) {
  const index = categoriesSelected.value.indexOf(category);

  if (index !== -1) {
    categoriesSelected.value.splice(index, 1);
  } else {
    categoriesSelected.value.push(category);
  }

  filtersData.value.category = categoriesSelected;
  emit("filterDone", { data: filtersData.value });
}

function validateSelectionClothingTypes(type) {
  const index = clothingTypesfilter.value.indexOf(type);

  if (index !== -1) {
    clothingTypesfilter.value.splice(index, 1);
  } else {
    clothingTypesfilter.value.push(type);
  }

  filtersData.value.clothingTypes = clothingTypesfilter;
  emit("filterDone", { data: filtersData.value });
}

function validateSelectionDayTimes(time) {
  const index = dayTimes.value.indexOf(time);

  if (index !== -1) {
    dayTimes.value.splice(index, 1);
  } else {
    dayTimes.value.push(time);
  }
  filtersData.value.timeday = dayTimes;
  emit("filterDone", { data: filtersData.value });
}

const formattedDate = computed(() => {
  return selectedDate.value
    ? new Date(selectedDate.value).toLocaleDateString()
    : "No seleccionado";
});

const formattedDateUse = computed(() => {
  return dateUse.value
    ? new Date(dateUse.value).toLocaleDateString()
    : "No seleccionado";
});

function removeDate() {
  selectedDate.value = null;

  filtersData.value.dateCreation = selectedDate.value;
  emit("filterDone", { data: filtersData.value });
}
function removeDate2() {
  dateUse.value = null;
}

function appendColor(id) {
  const index = colorsFilters.value.indexOf(id);
  if (index >= 0) {
    colorsFilters.value.splice(index, 1);

    document.getElementById(id).classList.remove("active");
  } else {
    colorsFilters.value.push(id);
    document.getElementById(id).classList.add("active");
  }

  colorsFilters.value = [...new Set(colorsFilters.value)];

  filtersData.value.colors = colorsFilters;

  emit("filterDone", { data: filtersData.value });
}

const colors = Constants.COLORS;

function filterSearch(e) {
  filtersData.value.filter = filterInput;
  emit("filterDone", { data: filtersData.value });
}

function dateCreateEvent() {
  filtersData.value.dateCreation = selectedDate.value;
  emit("filterDone", { data: filtersData.value });
}

function generateIdColorWithUUID(color) {
  const uuid = crypto.randomUUID();
  return `${color}-${uuid}`;
}
</script>
<template>
  <div class="menu">
    <div class="menu-options">
      <p class="text-menu">FILTROS</p>
      <div class="sub-menu">
        <div class="option-sbm">
          <div class="search">
            <v-text-field
              prepend-inner-icon="mdi-magnify"
              label="Buscar"
              variant="outlined"
              v-model="filterInput"
              @input="filterSearch"
            ></v-text-field>
            <p  class="section" v-if="!showOutfits && props.showTypesClothing">Tipos de prenda</p>
            <div v-if="!showOutfits && props.showTypesClothing" class="categories">
              <v-btn
                v-for="cl in clothingTypes"
                class="btn-category"
                :variant="clothingTypesfilter.includes(cl) ? 'flat' : 'plain'"
                @click="validateSelectionClothingTypes(cl)"
                color="primary"
              >
                {{ cl }}
              </v-btn>
            </div>
          </div>
          <p v-if="showOutfits" class="section">Categoria</p>
          <div v-if="showOutfits" class="categories">
            <v-btn
              v-for="category in categoriesItems"
              class="btn-category"
              :variant="
                categoriesSelected.includes(category) ? 'flat' : 'plain'
              "
              @click="validateSelection(category)"
              color="primary"
            >
              {{ category }}
            </v-btn>
          </div>

          <p v-if="showOutfits" class="section ct">Tiempo día</p>
          <div v-if="showOutfits" class="categories">
            <v-btn
              v-for="dt in dayTimesItems"
              class="btn-category"
              :variant="dayTimes.includes(dt) ? 'flat' : 'plain'"
              @click="validateSelectionDayTimes(dt)"
              color="primary"
            >
              {{ dt }}
            </v-btn>
          </div>

          <div class="colors" v-if="props.showColors ?? true">
            <p class="section">Colores</p>
            <div class="elements-colors">
              <div
                v-for="color in colors"
                :key="color.value"
                class="color"
                :id="generateIdColorWithUUID(color.value.toLowerCase())"
                :style="{ backgroundColor: color.value }"
                @click="appendColor($event.target.id)"
              >
                <v-tooltip
                  :activator="'#' + color.name.toLowerCase()"
                  location="bottom"
                >
                  {{ color.name }}
                </v-tooltip>
              </div>
            </div>
          </div>

          <div class="date">
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template #activator="{ props }">
                <div class="buttons-date">
                  <v-btn
                    class="btn-show-datepicker"
                    v-bind="props"
                    variant="outlined"
                  >
                    <v-icon start>mdi-calendar</v-icon>
                    <p>{{ "Fecha creación: " + formattedDate }}</p>
                  </v-btn>
                  <v-btn
                    @click="removeDate()"
                    v-if="selectedDate"
                    icon="mdi-close"
                    variant="text"
                  >
                  </v-btn>
                </div>
              </template>

              <v-date-picker
                v-model="selectedDate"
                @update:model-value="
                  menu = false;
                  dateUse = null;
                  dateCreateEvent();
                "
              ></v-date-picker>
            </v-menu>

            <v-menu
              v-model="menu2"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template #activator="{ props }" v-if="showOutfits">
                <div class="buttons-date">
                  <v-btn
                    class="btn-show-datepicker"
                    v-bind="props"
                    variant="outlined"
                  >
                    <v-icon start>mdi-calendar</v-icon>
                    <p>{{ "Fecha uso: " + formattedDateUse }}</p>
                  </v-btn>
                  <v-btn
                    @click="removeDate2()"
                    v-if="dateUse"
                    icon="mdi-close"
                    variant="text"
                  >
                  </v-btn>
                </div>
              </template>

              <v-date-picker
                v-model="dateUse"
                @update:model-value="
                  menu2 = false;
                  selectedDate = null;
                "
              ></v-date-picker>
            </v-menu>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.categories {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 15px;
}

.menu {
  border: 1px solid rgba(255, 255, 255, 0.13);
  width: 400px;
  height: max-content;
  margin: 30px;
  border-radius: 10px;
  position: relative;
  overflow-y: auto;
  max-height: 85vh;
}
.ct {
  margin-top: 30px;
}
.menu-options {
  margin: 20px;
}

.menu::-webkit-scrollbar {
  width: 4px; /* 🔹 Grosor del scroll */
}

.menu::-webkit-scrollbar-thumb {
  background-color: rgba(119, 119, 119, 0.1); /* 🔹 Color tenue del scroll */
  border-radius: 10px;
}

.menu::-webkit-scrollbar-track {
  background: transparent;
}

.text-menu {
  font-size: 20px;
  margin: 20px;
  font-weight: bold;
}

.colors {
  margin-top: 30px;
}
.date {
  margin-top: 30px;
}
.elements-colors {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.color {
  width: 30px;
  height: 30px;
  border-radius: 50px;
  cursor: pointer;
  border: 2px solid #86868667;
}

.color.active {
  border: 2px solid #42a5f5;
  box-shadow: 0 0 10px #42a5f5, 0 0 20px #42a5f5, 0 0 30px #42a5f5;
  transition: box-shadow 0.3s ease;
}
.btn-show-datepicker {
  height: 60px !important;
  display: flex;
  justify-content: space-between;
}

.date {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.buttons-date {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>

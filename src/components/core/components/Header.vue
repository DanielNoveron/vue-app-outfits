<script setup>
import { ref, watch, onMounted } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();

let isThemeDark = localStorage.getItem("isThemeDark");
let isDark = ref(localStorage.getItem("isThemeDark") === "true");

onMounted(() => {
  theme.global.name.value = isDark.value ? "dark" : "light";
});

// Cambiar el tema al cambiar el toggle
watch(isDark, (val) => {
  theme.global.name.value = val ? "dark" : "light";
});

function toggleTheme() {
  isDark.value = !isDark.value;
  theme.global.name.value = isDark.value ? "dark" : "light";
  localStorage.setItem("isThemeDark", isDark.value.toString());
}
</script>
<template>
  <div class="header light-effect glow">
    <h1 class="name-app">GN | Daniel Noverón</h1>

    <nav>
      <ul>
        <li>Inicio</li>
        <li>Outfits</li>
      </ul>
    </nav>

    <!-- Botón para cambiar tema -->
    <div class="theme-toggle-wrapper">
      <v-btn
        size="small"
        variant="tonal"
        color="secondary"
        class="btn-theme"
        @click="toggleTheme"
      >
        {{ isDark ? "☀️ Claro" : "🌙 Oscuro" }}
      </v-btn>
    </div>
  </div>
</template>
<style scoped>
.header {
  background-color: var(--color-principal);
  width: 100%;
  height: 100px;
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  gap: 40px;
  z-index: 1;
}

.name-app {
  color: var(--color-blanco);
  margin-left: 30px;
  font-weight: normal;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

nav {
  width: 50%;
  color: var(--color-blanco);
  font-size: var(--font-size-default);
  font-family: var(--font-family-default);
}

nav > ul > li {
  list-style: none;
  cursor: pointer;
  padding: 10px;
  position: relative;
}

nav > ul > li::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: var(--color-azul);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

nav > ul > li:hover::after {
  width: 100%;
}

ul {
  display: flex;
  flex-direction: row;
  gap: 50px;
}

.light-effect {
  padding: 20px;
  color: white;
  font-family: sans-serif;
  text-align: center;
  /* Luz blanca sutil en el borde inferior */
  box-shadow: 0 2px 10px rgba(255, 255, 255, 0.13);
}
.theme-toggle-wrapper {
  margin-left: auto; /* 💡 Esto empuja el botón a la derecha */
}
</style>

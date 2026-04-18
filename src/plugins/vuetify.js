// src/plugins/vuetify.js
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
import colors from 'vuetify/util/colors'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi: {
        component: 'mdi', // También puedes omitir esto si no usas componentes personalizados
      },
    },
  },

  theme: {
    defaultTheme: "dark",
    themes: {
      dark: {
        dark: true,
        colors: {
          background: "#0A0F14",
          surface: "#0A0F14",
          primary: colors.blue.accent3,
          secondary: colors.blue.darken4,
          error: "#cf6679",
        },
      },
      light: {
        dark: false,
        colors: {
          background: "#FFFFFF",
          surface: colors.blue.accent3,
          primary: colors.blue.darken4,
        },
      },
    },
  },
});

export default vuetify;

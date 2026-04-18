import { reactive } from 'vue'

const snackbar = reactive({
  show: false,
  text: '',
  color: 'success',
  timeout: 4000,
})

function notify(text, color = 'success') {
  snackbar.text = text
  snackbar.color = color
  snackbar.show = true
}

export function useNotifier() {
  return {
    snackbar,
    notify,
  }
}

import Outfits from "@/views/outfits/Outfits.vue";
import { createRouter, createWebHistory } from "vue-router";


const routes = [
    {path: '/', component: Outfits}
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})
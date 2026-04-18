export const ApiPaths = {
    ClothingCreate: "/sp/prendas/crear",
    ClothingUpdate: "/sp/prendas/actualizar",
    ClothingGetFilters: "/sp/prendas/obtenerPrendas",
    ClothingDelete: "/sp/prendas/eliminar",

    OutfitSave: "/sp/outfits/crear",
    OutfitUpdate: "/sp/outfits/actualizar",
    OutfitGetFilters: "/sp/outfits/obtenerOutfits",
    OutfitSetFavorite: "/sp/outfits/favorito",
    OutfitDelete: "/sp/outfits/eliminar"
}

// ESTOS SON LOS PATH EN LOS CUALES NO SE ACTIVARÁ EL SPINNER DE CARGA
export const ApiPathsExcludeToLoading = [
    ApiPaths.ClothingGetFilters,
    ApiPaths.OutfitGetFilters,
    ApiPaths.OutfitSetFavorite
]
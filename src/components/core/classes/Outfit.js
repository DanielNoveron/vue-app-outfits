export class Outfit {
    constructor(id, nombre, categoria, tiempoDia, fechaCreacion, color, imagen, fechaUltimoUso, listaPrendasSupreriores, listaPrendasInferiores, listaPrendasAccesorios, listaPrendasCalzado){
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria;
        this.tiempoDia = tiempoDia;
        this.fechaCreacion = fechaCreacion;
        this.color = color;
        this.imagen = imagen;
        this.fechaUltimoUso = fechaUltimoUso;
        this.listaPrendasSupreriores = listaPrendasSupreriores;
        this.listaPrendasInferiores = listaPrendasInferiores;
        this.listaPrendasAccesorios = listaPrendasAccesorios;
        this.listaPrendasCalzado = listaPrendasCalzado;
    }
}
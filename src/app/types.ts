export interface Viaje {
    id: number;
    conductor: string;
    rut_conductor: string;
    capa_disp: number;
    destino: string;
    lat: string;
    long: string;
    dis_met: number;
    tie_min: number;
    estado: string;
    valor: number;
    hora_salida: string;
    pasajeros: string[];
    pasajerosNombres?: string[];
}

export interface Persona {
    id: number;
    cant_asiento: number;
    categoria: string;
    color: string;
    contra: string;
    contraVali: string;
    email: string;
    fecha_nacimiento: string;
    genero: string;
    marca: string;
    modelo: string;
    nombre: string;
    patente: string;
    rut: string;
    tiene_auto: string;
}
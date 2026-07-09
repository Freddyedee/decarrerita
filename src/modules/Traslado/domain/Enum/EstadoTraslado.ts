export enum EstadoTraslado {

    /**
     * El cliente acaba de solicitar el viaje.
     */
    SOLICITADO = "SOLICITADO",

    /**
     * El sistema genera la cola de ofertas
     * y busca un chofer.
     */
    BUSCANDO_CHOFER = "BUSCANDO_CHOFER",

    /**
     * Un chofer aceptó correctamente
     * la asignación.
     */
    ASIGNADO = "ASIGNADO",

    /**
     * El viaje está en ejecución.
     */
    EN_CURSO = "EN_CURSO",

    /**
     * Todos los candidatos rechazaron. 
     */
    SIN_CHOFER      = "SIN_CHOFER",

    /**
     * El viaje terminó.
     */
    FINALIZADO = "FINALIZADO",

    /**
     * El viaje fue cancelado.
     */
    CANCELADO = "CANCELADO"

}
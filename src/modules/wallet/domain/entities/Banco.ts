export class Banco {

    constructor(
        public readonly id: number,
        public readonly nombre: string,
        public readonly codigo: string,
        public readonly activo: boolean
    ) {}

}
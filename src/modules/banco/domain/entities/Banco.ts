/**
 * Entidad de Dominio: Banco
 * Representa la abstracción pura de un banco dentro del sistema "Decarrerita".
 * Esta clase NO debe tener dependencias de Prisma, Next.js o librerías externas.
 */

export class Banco {

    public id_banco?: number; 
    public codigo_banco: string; 
    public nombre_banco: string; 
    public activo:boolean; 

    constructor(
        codigo_banco: string, 
        nombre_banco: string, 
        activo: boolean = true, 
        id_banco?: number 
    ){
        this.codigo_banco = codigo_banco;
        this.nombre_banco = nombre_banco;
        this.activo = activo;
        this.id_banco = id_banco;
    }

    
    // Validar que el código del banco siempre tenga exactamente 4 dígitos (0102, 0105, etc.)
  public validate(): void {
    if (!this.codigo_banco || this.codigo_banco.length !== 4) {
      throw new Error("El código del banco debe tener exactamente 4 caracteres.");
    }
    if (!this.nombre_banco) {
      throw new Error("El nombre del banco es obligatorio.");
    }
  }
}



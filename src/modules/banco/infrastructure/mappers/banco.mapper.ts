import { Banco } from "../../domain/entities/Banco";
import { BancoResponseDto } from "../../application/DTO/BancoResponseDto";

export class BancoMapper {
  static toDto(banco: Banco): BancoResponseDto {
    return {
      // Usamos los nombres exactos que definiste en public id_banco y public nombre_banco
      id: banco.id_banco as number, 
      codigo_banco: banco.codigo_banco, 
      nombre: banco.nombre_banco,
      activo: banco.activo,
    };
  }

  static toDtoList(bancos: Banco[]): BancoResponseDto[] {
    return bancos.map(banco => this.toDto(banco));
  }
}
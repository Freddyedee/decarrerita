// domain/repositories/IConfiguracionRepository.ts

export interface IConfiguracionRepository {
    findByNombre(nombre: string): Promise<string | null>;
    setValor(nombre: string, valor: string, descripcion?: string): Promise<void>;
    findAll(): Promise<{ nombre: string; valor: string; descripcion: string }[]>;
}
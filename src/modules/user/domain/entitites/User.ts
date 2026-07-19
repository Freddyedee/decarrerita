import { Email } from "../value-objects/Email";
import { PasswordHash } from "../value-objects/PasswordHash";
import { UserRole } from "../enums/UserRole";
import { UserStatus } from "../enums/UserStatus";
import { PersonName, Phone } from "../value-objects";

/**
 * ============================================================
 * Entity: User
 * ============================================================
 *
 * Representa la cuenta base de CUALQUIER persona en el sistema
 * (cliente, chofer, administrador o personal administrativo).
 * Los datos que son comunes a los 5 tipos de usuario viven acá;
 * lo que es específico de cada rol vive en su propia entidad
 * (Client, Driver) — este es el patrón de "especialización" que
 * refleja la base de datos: `usuario` es la tabla base, `cliente`
 * y `chofer` son tablas hijas 1:1 que solo existen para los
 * usuarios con ese rol.
 *
 * RN-026: un usuario con rol CLIENT o DRIVER SIEMPRE debe tener
 * su fila especializada (cliente/chofer) creada — nunca puede
 * existir un usuario cliente/chofer "huérfano", sin su
 * contraparte. Esta entidad no sabe nada de eso (no conoce a
 * Client ni a Driver, para no acoplar el módulo a sí mismo); es
 * CreateUserUseCase quien garantiza esto, creando ambas filas
 * dentro de una misma transacción (ver ese UseCase).
 *
 * Esta entidad NO valida reglas de negocio de dominio pesadas
 * (eso ya lo hacen los Value Objects en el constructor de cada
 * uno — Email, Phone, PersonName, PasswordHash). Su trabajo es
 * simplemente orquestar el reemplazo consistente de esos VOs.
 *
 * ============================================================
 */
export class User {

    constructor(
        readonly userid: number | null,
        private role: UserRole,
        private userFirstName: PersonName,
        private userLastName: PersonName,
        private email: Email,
        private phone: Phone,
        private passwordHash: PasswordHash,
        private status: UserStatus,
        readonly createdAt: Date,
    ) {}

    /**
     * Reemplaza todo el perfil de una vez. Los Value Objects ya
     * llegan validados (se construyen con .create() ANTES de
     * llamar a este método, típicamente en el UseCase) — por eso
     * esta entidad no vuelve a validar formato acá, solo aplica
     * el cambio de forma atómica: o se actualizan los 5 campos, o
     * ninguno (si algún VO.create() falla antes, no se llega a
     * mutar nada).
     */
    changeProfile(firstName: PersonName,
                    lastName: PersonName,
                    email: Email,
                    phone: Phone,
                    passwordHash: PasswordHash): void {
    this.userFirstName = firstName;
    this.userLastName = lastName;
    this.email = email;
    this.phone = phone;
    this.passwordHash = passwordHash;
    }

    /**
     * Cambia el estado de la cuenta (ACTIVO/INACTIVO/SUSPENDIDO).
     * A propósito NO valida transiciones (ej. no impide pasar de
     * SUSPENDIDO a ACTIVO) — a diferencia del ciclo de vida de un
     * Traslado, el estado de una cuenta de usuario es reversible
     * en cualquier dirección por decisión administrativa, así que
     * no existe una máquina de estados estricta acá.
     */
    changeStatus(status: UserStatus): void {
    this.status = status;
    }   

    getFirstName() {
        return this.userFirstName;
    }

    getLastName() {
        return this.userLastName;
    }

    getEmail() {
        return this.email;
    }

    getRole() {
        return this.role;
    }

    getPhone() {
        return this.phone;
    }

    getPasswordHash() {
        return this.passwordHash;
    }


    /**
     * Usado por Auth (LoginUseCase) para bloquear el login de
     * cuentas inactivas o suspendidas — ver ese caso de uso en el
     * módulo auth. Nota: por instrucción del equipo, Auth queda
     * fuera del alcance de esta revisión, pero se documenta acá
     * porque ES el único consumidor externo de este método.
     */
    isActive(){
        return this.status == UserStatus.ACTIVO;
    }

    getStatus() {
        return this.status;
    }

    /**
     * `userid` es `number | null` porque, antes de guardarse,
     * un User recién construido (en CreateUserUseCase) todavía no
     * tiene id — lo asigna la base de datos (autoincrement). Este
     * getter existe para los puntos del código donde SÍ es
     * seguro asumir que el usuario ya fue persistido (ej. después
     * de un findById/update); si se llama sobre un User todavía
     * no guardado, es un bug del caller y por eso lanza en vez de
     * devolver null silenciosamente.
     */
    getUserId(): number {

        if (this.userid === null) {

            throw new Error("User has not been persisted.");

        }

        return this.userid;

    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

}
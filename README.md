<div align="center">
  <h1>Decarrerita</h1>
  <p><b>Sistema Integral de Ridesharing, Gestión de Flotas y Billetera Virtual</b></p>
  <p>Desarrollado para la carrera de Ingeniería en Informática en la <b>Universidad Nacional Experimental de Guayana (UNEG)</b>.</p>
</div>

---

## Descripción del Proyecto

**Decarrerita** es una plataforma integral de transporte y gestión de flota, construida bajo los principios de **Clean Architecture** y **Domain-Driven Design (DDD)**. El sistema orquesta la solicitud de traslados en tiempo real, la administración financiera mediante billeteras virtuales (Wallets), la auditoría del personal administrativo y un control operativo riguroso de vehículos y conductores.

## Tecnologías y Herramientas

- **Core:** [Next.js](https://nextjs.org/) (App Router) con TypeScript
- **Base de Datos:** PostgreSQL (alojada en [Neon](https://neon.tech/))
- **ORM:** Prisma, con optimizaciones de consultas mediante SQL crudo
- **Estilos e Interfaz:** Tailwind CSS, shadcn/ui, Radix UI, Lucide Icons

---

## Arquitectura (Clean Architecture y DDD)

El código fuente se encuentra estrictamente modularizado. El sistema garantiza que las capas externas se comuniquen únicamente hacia las internas, asegurando escalabilidad, inyección de dependencias y facilidad de mantenimiento:

1. **Presentation (Presentación):** Controladores, enrutadores y componentes de interfaz encargados de gestionar las peticiones HTTP.
2. **Application (Aplicación):** Casos de uso (Use Cases) y DTOs (Data Transfer Objects) responsables de validar los datos y orquestar los flujos de información (por ejemplo, `SolicitarTrasladoUseCase`).
3. **Domain (Dominio):** Núcleo del negocio. Contiene entidades puras, enumeraciones que representan máquinas de estado y contratos (interfaces), completamente independientes de frameworks o tecnologías externas.
4. **Infrastructure (Infraestructura):** Implementación técnica del sistema, repositorios de Prisma y mappers (por ejemplo, `PrismaUserRepository`).

### Estructura Modular Central

El proyecto está organizado en subdominios lógicos independientes:

- `user/` — Gestión de roles: clientes, conductores y evaluaciones psicológicas.
- `vehicles/` — Gestión de flota, marcas y revisiones.
- `traslado/` — Motor principal del sistema de ridesharing.
- `tarifa/` — Gestión de precios y comisiones dinámicas.
- `wallet/` — Ecosistema financiero, recargas y retiros.
- `banco/`, `auth/`, `calificacion/`, `configuracion/` — Módulos de soporte transversal.

---

## Características y Funcionalidades Principales

### Panel de Administración

- **Consultas SQL optimizadas (resolución de N+1):** para evitar los múltiples accesos a la base de datos característicos de los ORMs en consultas analíticas, los módulos administrativos (directorio general, monitor global, gestión de flota) emplean sentencias SQL nativas con `JOINs`. Esto permite cargar el panel del sistema, junto con sus métricas y cruces de entidades, en una sola petición.
- **Auditoría administrativa:** módulo de seguridad que registra, con identificador, marca de tiempo y observación, cada acción crítica ejecutada en el sistema, garantizando así su trazabilidad.

### Motor de Traslados

- **Máquina de estados estricta:** el ciclo de vida de un viaje está rigurosamente controlado mediante los estados `PENDIENTE`, `ASIGNADO`, `EN_CURSO` y `COMPLETADO` (o `CANCELADO`).
- **Comunicación entre módulos:** el `CompletarTrasladoUseCase` se encuentra desacoplado del manejo del dinero; orquesta eventos para que el módulo de `Wallet` ejecute las transacciones de pago correspondientes mediante inyección de dependencias.

### Ecosistema Financiero (Wallet)

- Cada usuario cuenta con una billetera virtual propia.
- **División automatizada de pagos:** al finalizar un viaje, el sistema liquida y retiene dinámicamente el porcentaje correspondiente a la ganancia de la empresa y al margen del conductor, registrando el detalle en el historial de `MovimientoWallet`.
- Gestión y auditoría de recargas mediante transferencias bancarias, así como el procesamiento de solicitudes de retiro por parte de los conductores.

### Calidad y Control Operativo

- **Conductores:** evaluación psicológica obligatoria, con criterios estrictos de aprobación, además del registro de contactos de emergencia.
- **Flota:** revisiones vehiculares periódicas con validación de fechas de vencimiento. El sistema inhabilita automáticamente a cualquier entidad que no cumpla con los estándares de aprobación establecidos.

---

## Instalación y Despliegue Local

### Requisitos Previos

- Node.js (v18 o superior)
- Una instancia de PostgreSQL (se recomienda Neon.tech)

### Pasos

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/tu-usuario/decarrerita.git
   cd decarrerita
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Configurar las variables de entorno:**

   Crear un archivo `.env` en la raíz del proyecto, basado en `.env.example`:

   ```
   DATABASE_URL="postgresql://usuario:password@host:puerto/db?sslmode=require"
   ```

4. **Sincronizar el esquema de Prisma con la base de datos:**

   ```bash
   npx prisma db push
   # o, si se utilizan migraciones formales:
   npx prisma migrate dev
   ```

5. **Iniciar el servidor de desarrollo:**

   ```bash
   npm run dev
   ```

   El sistema estará disponible en `http://localhost:3000`.

---

## Equipo de Desarrollo

Este sistema fue concebido, diseñado y desarrollado por:

- Freddy Marcano
- Sebastián Argotte

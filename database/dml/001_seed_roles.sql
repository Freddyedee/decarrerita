

INSERT INTO rol (nombre, descripcion)

VALUES 

(
    'Administrador', 'Gestiona la configuracion del sistema, usuarios y supervisa las operaciones administrativas.'
    
),

(
    'Cliente', 'Usuario que solicita traslados y realiza pagos mediante su billetera virtual.'
    
),

(
    'Chofer', 'Usuario autorizado para aceptar solicitudes de traslados y prestar los servicios de transporte a los clientes.'    
),

(
    'Sistema', 'Cuenta técnica interna que representa a la plataforma Decarrerita, usada para la intermediación de pagos en la wallet de la empresa. No corresponde a una persona real ni tiene acceso de login.'
);

SELECT * FROM rol;

DELETE FROM rol WHERE id_rol = 35;
ALTER SEQUENCE rol_id_rol_seq RESTART WITH 4;

INSERT INTO rol (nombre, descripcion)
VALUES ('Sistema', 'Cuenta técnica interna que representa a la plataforma Decarrerita, usada para la intermediación de pagos en la wallet de la empresa. No corresponde a una persona real ni tiene acceso de login.');
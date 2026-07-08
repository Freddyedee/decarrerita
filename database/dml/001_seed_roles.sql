

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
);

SELECT * FROM rol;

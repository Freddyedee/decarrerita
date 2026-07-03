-- SEED DE CLIENTES
-- Objetivo: Crear usuarios con rol 'Cliente' y sus perfiles asociados.


-- el hecho de usar select en el insert de usuario es para obtener el id_rol correspondiente al rol 'cliente' y asi asignarlo automaticamente al nuevo usuario,
-- las implicaciones de no hacerlo suponen un escenario de preguntarnos como sabemos que el id_rol de cliente es 2, 0 4 o 5? esto puede depender del entorno donde se desarolle la base de datos, utilizar 
-- un numero fijo es como usar una constante harcodeamos algo que puede cambiar, con select no dependemos de un valor fijo y nos aseguramos de que siempre se asigne el id_rol correcto al nuevo usuario.
--Si el rol no existe, el SELECT devuelve NULL y el INSERT fallara con un error de NOT NULL. Validación contenplada en la declaracion del atributo. 

--El uso de WITH (o RETURNING) en la insercion de usuario es para obtener el id_usuario generado automaticamente por la base de datos, ya que es un atributo SERIAL y no podemos conocerlo antes de la insercion.
--Esto evita el siguiente problema: si muchas personas insertan datos al mismo tiempo, hacemos el primer INSERT y, antes de que hagas el segundo INSERT, otra persona iserta un usario, el id "adivinado" ya no es el mismo y por lo tanto no es el correcto
-- el cliente termina asociado a un usuario que no es el suyo. Con el uso de WITH (o RETURNING) obtenemos el id_usuario correcto generado por la base de datos y lo usamos para insertar el perfil del cliente y su wallet.  

BEGIN; 

-- 1. Insertamos nuevo cliente con el rol 'Cliente' y su perfil asociado

WITH nuevo_usuario AS (

    INSERT INTO usuario (id_rol, nombre, apellido, email, telefono, password_hash, estado)
    
    VALUES (
        (SELECT id_rol FROM rol WHERE nombre = 'Cliente'), 'Freddy', 'Marcano', 'freddy@gmail.com', '04249545985', '@dRXEE@@X', 'activo'
    )
    RETURNING id_usuario
)

INSERT INTO cliente (id_usuario, rating_promedio) 
SELECT id_usuario, 5.00 FROM nuevo_usuario;


INSERT INTO wallet (id_usuario, saldo_disponible, moneda)
VALUES (

    (SELECT id_usuario FROM usuario WHERE email = 'freddy@gmail.com') , 50.00 , 'USD'
);

--2. Insertamos otro cliente con el rol 'Cliente' y su perfil asociado
WITH nuevo_usuario AS (

    INSERT INTO usuario (id_rol, nombre, apellido, email, telefono, password_hash, estado)
    
    VALUES (
        (SELECT id_rol FROM rol WHERE nombre = 'Cliente'), 'Alejandro', 'Marcano', 'alejandro@gmail.com', '04249545986', '@dRXEE@@X', 'activo'
    )
    RETURNING id_usuario
)

INSERT INTO cliente (id_usuario, rating_promedio) 
SELECT id_usuario, 5.00 FROM nuevo_usuario;

INSERT INTO wallet (id_usuario, saldo_disponible, moneda)
VALUES (

    (SELECT id_usuario FROM usuario WHERE email = 'alejandro@gmail.com') , 50.00 , 'USD'
);

COMMIT; 

SELECT * FROM usuario;



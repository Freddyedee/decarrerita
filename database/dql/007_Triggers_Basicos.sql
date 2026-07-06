--TRIGGERS 1: CREACION AUTOMATICA DE LA WALLLET 

--OBJETIVO: cada vez que se crea un usuario se crea su wallet automaticamente, esto garantiza integridad

CREATE OR REPLACE FUNCTION fn_crear_wallet_usuario() RETURNS TRIGGER AS $$ BEGIN

    INSERT INTO wallet (id_usuario, saldo_disponible, saldo_congelado, moneda)
    VALUES (NEW.id_usuario, 0,0, 'USD'); 

    RETURN NEW; 

END; 

$$ LANGUAGE plpgsql; 

CREATE TRIGGER trg_crear_wallet
AFTER INSERT ON usuario
FOR EACH ROW
EXECUTE FUNCTION fn_crear_wallet_usuario();

-- TEST DE TRIGGER. 

INSERT INTO usuario ( id_rol, nombre, apellido, email, telefono, password_hash, estado) VALUES (1, 'Test', 'User', 'test@test.com', '000', 'hash', 'activo'); 
INSERT INTO usuario ( id_rol, nombre, apellido, email, telefono, password_hash, estado) VALUES (1, 'Pedro', 'User', 'pedro@pedro.com', '0414587889000', 'hash', 'activo'); 

SELECT u.nombre, u.apellido, w.id_wallet, w.id_usuario ,w.saldo_disponible FROM usuario u  JOIN wallet w ON u.id_usuario = w.id_usuario;

--TRIGGER 2 - AUDITORIA DE TRASLADOS


--FUNCION
CREATE OR REPLACE FUNCTION fn_auditar_traslado() RETURNS TRIGGER AS $$ BEGIN

INSERT INTO historial_estado_traslado (id_traslado, estado_anterior, estado_nuevo, observacion) VALUES (NEW.id_traslado, OLD.estado_actual, NEW.estado_actual,'Cambio automático registrado por trigger');

RETURN NEW; 

END;

--TRIGGER 

$$ LANGUAGE plpgsql; 

CREATE TRIGGER trg_auditoria_traslados
AFTER UPDATE OF estado_actual ON traslado
FOR EACH ROW
EXECUTE FUNCTION fn_auditar_traslado();

--TEST 

UPDATE traslado
SET estado_actual = 'EN_CURSO'
WHERE id_traslado = 1;

SELECT * FROM historial_estado_traslado;




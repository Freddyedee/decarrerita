--Índice 1: estado de traslados

CREATE INDEX idx_traslado_estado
ON traslado(estado_actual);

--Índice 2: búsquedas por usuario
CREATE INDEX idx_usuario_email
ON usuario(email);

--Índice 3: wallet lookup
CREATE INDEX idx_wallet_usuario
ON wallet(id_usuario);
CREATE TABLE IF NOT EXISTS modelo (
    id_modelo SERIAL PRIMARY KEY,
    id_marca INTEGER NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    CONSTRAINT fk_modelo_marca FOREIGN KEY (id_marca) REFERENCES marca(id_marca) ON DELETE CASCADE
);

SELECT * FROM modelo;

-- ====================================================================
-- SEED DE CATÁLOGO: MARCAS DE VEHÍCULOS (DECARRERITA)
-- ====================================================================

INSERT INTO "public"."marca" ("nombre") VALUES
  ('Toyota'),
  ('Chevrolet'),
  ('Ford'),
  ('Hyundai'),
  ('Nissan'),
  ('Mitsubishi'),
  ('Volkswagen'),
  ('Honda'),
  ('Kia'),
  ('Fiat'),
  ('Renault'),
  ('Jeep'),
  ('Mazda'),
  ('Chery'),
  ('Peugeot')
ON CONFLICT ("nombre") DO NOTHING;

-- ====================================================================
-- (OPCIONAL) SI TIENES UNA TABLA "modelo" RELACIONADA A "marca":
-- Descomenta este bloque solo si tu esquema tiene tabla public.modelo
-- ====================================================================

INSERT INTO "public"."modelo" ("id_marca", "nombre") VALUES
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Toyota' LIMIT 1), 'Corolla'),
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Toyota' LIMIT 1), 'Yaris'),
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Toyota' LIMIT 1), 'Hilux'),
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Chevrolet' LIMIT 1), 'Aveo'),
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Chevrolet' LIMIT 1), 'Optra'),
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Chevrolet' LIMIT 1), 'Cruze'),
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Ford' LIMIT 1), 'Fiesta'),
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Ford' LIMIT 1), 'Focus'),
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Hyundai' LIMIT 1), 'Elantra'),
  ((SELECT id_marca FROM public.marca WHERE nombre = 'Hyundai' LIMIT 1), 'Tucson')
ON CONFLICT DO NOTHING;

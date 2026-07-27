-- ====================================================================
-- SEED DE FLOTA VEHICULAR: MARCAS Y MODELOS (DECARRERITA)
-- ====================================================================

-- 1. LIMPIEZA Y RESEDEO DE TABLAS (Opcional, en cascada)
-- TRUNCATE TABLE modelo, marca RESTART IDENTITY CASCADE;

-- 2. INSERCIÓN DE MARCAS PRINCIPALES
INSERT INTO marca (nombre, descripcion) VALUES
('Chevrolet', 'Fabricante estadounidense (General Motors)'),
('Hyundai', 'Fabricante surcoreano, alta eficiencia y diseño moderno'),
('Nissan', 'Fabricante japonés, excelente rendimiento en sedanes y SUV'),
('Chery', 'Fabricante asiático, amplia presencia en flotas compactas'),
('Kia', 'Fabricante surcoreano, vehículos compactos y versátiles'),
('Mitsubishi', 'Fabricante japonés, durabilidad y tradición en el país'),
('Volkswagen', 'Fabricante alemán, ingeniería europea y compactos')
ON CONFLICT (nombre) DO NOTHING;

-- 3. INSERCIÓN DE MODELOS RELACIONADOS POR MARCA

-- TOYOTA
INSERT INTO modelo (id_marca, nombre) VALUES
((SELECT id_marca FROM marca WHERE nombre = 'Toyota'), 'Corolla'),
((SELECT id_marca FROM marca WHERE nombre = 'Toyota'), 'Yaris'),
((SELECT id_marca FROM marca WHERE nombre = 'Toyota'), 'Hilux'),
((SELECT id_marca FROM marca WHERE nombre = 'Toyota'), 'Fortuner'),
((SELECT id_marca FROM marca WHERE nombre = 'Toyota'), 'Terios'),
((SELECT id_marca FROM marca WHERE nombre = 'Toyota'), 'Meru'),
((SELECT id_marca FROM marca WHERE nombre = 'Toyota'), 'Prado'),
((SELECT id_marca FROM marca WHERE nombre = 'Toyota'), 'Camry');

-- CHEVROLET
INSERT INTO modelo (id_marca, nombre) VALUES
((SELECT id_marca FROM marca WHERE nombre = 'Chevrolet'), 'Aveo'),
((SELECT id_marca FROM marca WHERE nombre = 'Chevrolet'), 'Optra'),
((SELECT id_marca FROM marca WHERE nombre = 'Chevrolet'), 'Spark'),
((SELECT id_marca FROM marca WHERE nombre = 'Chevrolet'), 'Cruze'),
((SELECT id_marca FROM marca WHERE nombre = 'Chevrolet'), 'Corsa'),
((SELECT id_marca FROM marca WHERE nombre = 'Chevrolet'), 'Silverado'),
((SELECT id_marca FROM marca WHERE nombre = 'Chevrolet'), 'Tahoe'),
((SELECT id_marca FROM marca WHERE nombre = 'Chevrolet'), 'Orlando');

-- FORD
INSERT INTO modelo (id_marca, nombre) VALUES
((SELECT id_marca FROM marca WHERE nombre = 'Ford'), 'Fiesta'),
((SELECT id_marca FROM marca WHERE nombre = 'Ford'), 'Focus'),
((SELECT id_marca FROM marca WHERE nombre = 'Ford'), 'Explorer'),
((SELECT id_marca FROM marca WHERE nombre = 'Ford'), 'EcoSport'),
((SELECT id_marca FROM marca WHERE nombre = 'Ford'), 'F-150'),
((SELECT id_marca FROM marca WHERE nombre = 'Ford'), 'Ka'),
((SELECT id_marca FROM marca WHERE nombre = 'Ford'), 'Fusion');

-- HYUNDAI
INSERT INTO modelo (id_marca, nombre) VALUES
((SELECT id_marca FROM marca WHERE nombre = 'Hyundai'), 'Getz'),
((SELECT id_marca FROM marca WHERE nombre = 'Hyundai'), 'Elantra'),
((SELECT id_marca FROM marca WHERE nombre = 'Hyundai'), 'Accent'),
((SELECT id_marca FROM marca WHERE nombre = 'Hyundai'), 'Tucson'),
((SELECT id_marca FROM marca WHERE nombre = 'Hyundai'), 'Santa Fe'),
((SELECT id_marca FROM marca WHERE nombre = 'Hyundai'), 'Atos');

-- NISSAN
INSERT INTO modelo (id_marca, nombre) VALUES
((SELECT id_marca FROM marca WHERE nombre = 'Nissan'), 'Sentra'),
((SELECT id_marca FROM marca WHERE nombre = 'Nissan'), 'Tiida'),
((SELECT id_marca FROM marca WHERE nombre = 'Nissan'), 'Frontier'),
((SELECT id_marca FROM marca WHERE nombre = 'Nissan'), 'X-Trail'),
((SELECT id_marca FROM marca WHERE nombre = 'Nissan'), 'Kicks'),
((SELECT id_marca FROM marca WHERE nombre = 'Nissan'), 'Versa');

-- CHERY
INSERT INTO modelo (id_marca, nombre) VALUES
((SELECT id_marca FROM marca WHERE nombre = 'Chery'), 'Arauca'),
((SELECT id_marca FROM marca WHERE nombre = 'Chery'), 'Orinoco'),
((SELECT id_marca FROM marca WHERE nombre = 'Chery'), 'Tiggo'),
((SELECT id_marca FROM marca WHERE nombre = 'Chery'), 'X1'),
((SELECT id_marca FROM marca WHERE nombre = 'Chery'), 'QQ');

-- HONDA
INSERT INTO modelo (id_marca, nombre) VALUES
((SELECT id_marca FROM marca WHERE nombre = 'Honda'), 'Civic'),
((SELECT id_marca FROM marca WHERE nombre = 'Honda'), 'CR-V'),
((SELECT id_marca FROM marca WHERE nombre = 'Honda'), 'Accord'),
((SELECT id_marca FROM marca WHERE nombre = 'Honda'), 'Fit');

-- KIA
INSERT INTO modelo (id_marca, nombre) VALUES
((SELECT id_marca FROM marca WHERE nombre = 'Kia'), 'Rio'),
((SELECT id_marca FROM marca WHERE nombre = 'Kia'), 'Sportage'),
((SELECT id_marca FROM marca WHERE nombre = 'Kia'), 'Picanto'),
((SELECT id_marca FROM marca WHERE nombre = 'Kia'), 'Cerato');

-- MITSUBISHI
INSERT INTO modelo (id_marca, nombre) VALUES
((SELECT id_marca FROM marca WHERE nombre = 'Mitsubishi'), 'Lancer'),
((SELECT id_marca FROM marca WHERE nombre = 'Mitsubishi'), 'Signo'),
((SELECT id_marca FROM marca WHERE nombre = 'Mitsubishi'), 'Montero'),
((SELECT id_marca FROM marca WHERE nombre = 'Mitsubishi'), 'Outlander');

-- VOLKSWAGEN
INSERT INTO modelo (id_marca, nombre) VALUES
((SELECT id_marca FROM marca WHERE nombre = 'Volkswagen'), 'Gol'),
((SELECT id_marca FROM marca WHERE nombre = 'Volkswagen'), 'Fox'),
((SELECT id_marca FROM marca WHERE nombre = 'Volkswagen'), 'Polo'),
((SELECT id_marca FROM marca WHERE nombre = 'Volkswagen'), 'Jetta'),
((SELECT id_marca FROM marca WHERE nombre = 'Volkswagen'), 'Bora');

-- Verificación final
SELECT m.nombre AS marca, mo.nombre AS modelo 
FROM modelo mo 
JOIN marca m ON mo.id_marca = m.id_marca 
ORDER BY m.nombre, mo.nombre;
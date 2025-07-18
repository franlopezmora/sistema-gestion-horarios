-- init.sql

-- Asegurar que usamos el esquema público
SET search_path = public;

-- ─── Eliminar tablas si existen (para permitir múltiples ejecuciones) ───
DROP TABLE IF EXISTS DETALLE_CRONOGRAMA;
DROP TABLE IF EXISTS CRONOGRAMA;
DROP TABLE IF EXISTS COMISION_MATERIA_HORARIO;
DROP TABLE IF EXISTS COMISION_MATERIA;
DROP TABLE IF EXISTS HORARIO;
DROP TABLE IF EXISTS COMISION;
DROP TABLE IF EXISTS USUARIO;
DROP TABLE IF EXISTS MATERIA;
DROP TABLE IF EXISTS PERIODO;
DROP TABLE IF EXISTS CARRERA;

-- ─── Extensión para UUID ───────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── 1) Tabla de periodos (ANUAL, CUAT1, CUAT2) ───────────────────────
CREATE TABLE PERIODO (
  id           SERIAL PRIMARY KEY,
  codigo       VARCHAR(10)  NOT NULL UNIQUE,  -- 'ANUAL','CUAT1','CUAT2'
  descripcion  VARCHAR(255) NOT NULL
);

-- ─── 2) Materias genéricas ────────────────────────────────────────────
CREATE TABLE MATERIA (
  id             SERIAL PRIMARY KEY,
  codigo         VARCHAR(50)  NOT NULL UNIQUE,  -- código interno
  nombre         VARCHAR(255) NOT NULL,
  anio_carrera   SMALLINT     NOT NULL,
  electiva       BOOLEAN      NOT NULL DEFAULT FALSE
);

-- ─── 3) Tabla de carreras ───────────────────────────────────────────
CREATE TABLE CARRERA (
  id     SERIAL PRIMARY KEY,
  codigo VARCHAR(50)  NOT NULL UNIQUE,   -- p.ej. 'INFO','MECANICA'
  nombre VARCHAR(255) NOT NULL            -- p.ej. 'Ingeniería Informática'
);

-- ─── 4) Comisiones: un grupo de cursada ───────────────────────────────
CREATE TABLE COMISION (
  id       SERIAL PRIMARY KEY,
  seccion  VARCHAR(10) NOT NULL,  -- 'A','B',...
  carrera_id INTEGER NOT NULL
    REFERENCES CARRERA(id),
  CONSTRAINT uq_comision_carrera_seccion
    UNIQUE (carrera_id, seccion)
);

-- ─── 5) Franjas horarias genéricas ───────────────────────────────────
CREATE TABLE HORARIO (
  id          SERIAL PRIMARY KEY,
  dia_semana  VARCHAR(9) NOT NULL,  -- 'LUNES','MARTES',...
  hora_inicio TIME        NOT NULL,
  hora_fin    TIME        NOT NULL
);

-- ─── 6) Mapeo comisión → materia (con periodo) ───────────────────────
CREATE TABLE COMISION_MATERIA (
  id           SERIAL PRIMARY KEY,
  comision_id  INTEGER NOT NULL
    REFERENCES COMISION(id),
  materia_id   INTEGER NOT NULL
    REFERENCES MATERIA(id),
  periodo_id   INTEGER NOT NULL
    REFERENCES PERIODO(id),
  UNIQUE(comision_id, materia_id)
);

-- ─── 7) Mapeo comisión–materia → horario ─────────────────────────────
CREATE TABLE COMISION_MATERIA_HORARIO (
  id                   SERIAL PRIMARY KEY,
  comision_materia_id  INTEGER NOT NULL
    REFERENCES COMISION_MATERIA(id),
  horario_id           INTEGER NOT NULL
    REFERENCES HORARIO(id),
  UNIQUE(comision_materia_id, horario_id)
);

-- ─── 8) Tabla de usuarios ───────────────────────────────────────────
CREATE TABLE USUARIO (
  id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre    VARCHAR(255) NOT NULL,
  mail      VARCHAR(255) NOT NULL UNIQUE
);

-- ─── 9) Cronogramas (colección de franjas escogidas) ────────────────
CREATE TABLE CRONOGRAMA (
  id              SERIAL PRIMARY KEY,
  nombre          VARCHAR(255) NOT NULL,                  -- e.g. '1er cuat 2025'
  fecha_creacion  TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  usuario_id UUID 
    REFERENCES USUARIO(id)
);

-- ─── 10) Detalle de cronograma → cada módulo escogido ───────────────
CREATE TABLE DETALLE_CRONOGRAMA (
  id                             SERIAL PRIMARY KEY,
  cronograma_id                  INTEGER NOT NULL
    REFERENCES CRONOGRAMA(id),
  comision_materia_horario_id    INTEGER NOT NULL
    REFERENCES COMISION_MATERIA_HORARIO(id),
  estado                         VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE'
);

-- ─── Índices para acelerar JOINs y búsquedas por FK ─────────────────
CREATE INDEX idx_cm_comision
  ON COMISION_MATERIA (comision_id);
CREATE INDEX idx_cm_materia
  ON COMISION_MATERIA (materia_id);

CREATE INDEX idx_cmh_cm
  ON COMISION_MATERIA_HORARIO (comision_materia_id);
CREATE INDEX idx_cmh_horario
  ON COMISION_MATERIA_HORARIO (horario_id);

CREATE INDEX idx_dc_cronograma
  ON DETALLE_CRONOGRAMA (cronograma_id);
CREATE INDEX idx_dc_cmh
  ON DETALLE_CRONOGRAMA (comision_materia_horario_id);

CREATE INDEX idx_materia_electiva
  ON MATERIA (electiva);
CREATE INDEX idx_cronograma_usuario
  ON CRONOGRAMA (usuario_id);

CREATE INDEX idx_comision_carrera
  ON COMISION(carrera_id);
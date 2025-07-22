#!/usr/bin/env bash
set -euo pipefail

export PGPASSWORD="$POSTGRES_PASSWORD"
PSQL="psql -v ON_ERROR_STOP=1 \
           -U $POSTGRES_USER \
           -d $POSTGRES_DB \
           -q -1"

# the key bit: FORMAT csv, DELIMITER ';', HEADER, ENCODING 'WIN1252'
COPY_OPTS="WITH (FORMAT csv, DELIMITER ';', HEADER, ENCODING 'WIN1252')"

echo "==> Importando Periodos…"
$PSQL -c "\copy periodo(id,codigo,descripcion) FROM '/docker-entrypoint-initdb.d/data/Periodos.csv' $COPY_OPTS"

echo "==> Importando Materias…"
$PSQL -c "\copy materia(id,codigo,nombre,anio_carrera,electiva) FROM '/docker-entrypoint-initdb.d/data/Materias.csv' $COPY_OPTS"

echo "==> Importando Carreras…"
$PSQL -c "\copy carrera(id,codigo,nombre) FROM '/docker-entrypoint-initdb.d/data/Carreras.csv' $COPY_OPTS"

echo "==> Importando Comisiones…"
$PSQL -c "\copy comision(id,seccion,carrera_id) FROM '/docker-entrypoint-initdb.d/data/Comisiones.csv' $COPY_OPTS"

echo "==> Importando Horarios…"
$PSQL -c "\copy horario(id,dia_semana,hora_inicio,hora_fin) FROM '/docker-entrypoint-initdb.d/data/Horarios.csv' $COPY_OPTS"

echo "==> Importando Comision-Materia…"
$PSQL -c "\copy comision_materia(id,comision_id,materia_id,periodo_id) FROM '/docker-entrypoint-initdb.d/data/ComisionesMateria.csv' $COPY_OPTS"

echo "==> Importando ComisionMateria-Horario…"
$PSQL -c "\copy comision_materia_horario(id,comision_materia_id,horario_id) FROM '/docker-entrypoint-initdb.d/data/ComisionesMateriaHorarios.csv' $COPY_OPTS"

##echo "==> Importando Usuarios…"
#$PSQL -c "\copy usuario(id,nombre,mail) FROM '/docker-entrypoint-initdb.d/data/Usuarios.csv' #$COPY_OPTS"

#echo "==> Importando Cronogramas…"
#$PSQL -c "\copy cronograma(id,nombre,fecha_creacion,usuario_id) FROM '/docker-entrypoint-initdb.d/data/Cronogramas.csv' $COPY_OPTS"

#echo "==> Importando DetalleCronograma…"
#$PSQL -c "\copy detalle_cronograma(id,cronograma_id,estado,comision_materia_id) FROM '/docker-entrypoint-initdb.d/data/DetalleCronograma.csv' $COPY_OPTS"

echo "==> ¡Importación completada!"


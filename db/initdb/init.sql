create table periodo
(
    id          serial
        primary key,
    codigo      varchar(10)  not null
        unique,
    descripcion varchar(255) not null
);


create table materia
(
    id           serial
        primary key,
    codigo       varchar(50)           not null
        unique,
    nombre       varchar(255)          not null,
    anio_carrera smallint              not null,
    electiva     boolean default false not null
);


create index idx_materia_electiva
    on materia (electiva);

create table carrera
(
    id     serial
        primary key,
    codigo varchar(50)  not null
        unique,
    nombre varchar(255) not null
);


create table comision
(
    id         serial
        primary key,
    seccion    varchar(10) not null,
    carrera_id integer     not null
        references carrera,
    constraint uq_comision_carrera_seccion
        unique (carrera_id, seccion)
);


create index idx_comision_carrera
    on comision (carrera_id);

create table horario
(
    id          serial
        primary key,
    dia_semana  varchar(9) not null,
    hora_inicio time       not null,
    hora_fin    time       not null
);


create table comision_materia
(
    id          serial
        primary key,
    comision_id integer not null
        references comision,
    materia_id  integer not null
        references materia,
    periodo_id  integer not null
        references periodo,
    constraint uq_comision_materia_comision_materia_periodo
        unique (comision_id, materia_id, periodo_id)
);

create index idx_cm_comision
    on comision_materia (comision_id);

create index idx_cm_materia
    on comision_materia (materia_id);

create table comision_materia_horario
(
    id                  serial
        primary key,
    comision_materia_id integer not null
        references comision_materia,
    horario_id          integer not null
        references horario,
    unique (comision_materia_id, horario_id)
);


create index idx_cmh_cm
    on comision_materia_horario (comision_materia_id);

create index idx_cmh_horario
    on comision_materia_horario (horario_id);

create table usuario
(
    id     uuid default gen_random_uuid() not null
        primary key,
    nombre varchar(255)                   not null,
    mail   varchar(255)                   not null
        unique
);

create table cronograma
(
    id             serial
        primary key,
    nombre         varchar(255) not null,
    fecha_creacion timestamp default now(),
    usuario_id     uuid
        references usuario
);


create index idx_cronograma_usuario
    on cronograma (usuario_id);

create table detalle_cronograma
(
    id                  serial
        primary key,
    cronograma_id       integer                                            not null
        references cronograma,
    estado              varchar(20) default 'PENDIENTE'::character varying not null,
    comision_materia_id integer                                            not null
        references comision_materia
);

create index idx_dc_cronograma
    on detalle_cronograma (cronograma_id);


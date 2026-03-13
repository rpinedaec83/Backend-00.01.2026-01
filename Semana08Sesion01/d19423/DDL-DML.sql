DROP TABLE IF  EXISTS tblSexo;
DROP TABLE IF  EXISTS tblNacionalidad;
DROP TABLE IF  EXISTS tblUsuarios;

create table tblUsuarios(
	id serial primary key,
	username varchar(50) unique not null,
	password varchar(255) not null,
	email varchar(50) unique not null,
	isActivo BOOLEAN NOT NULL DEFAULT FALSE,
	usuarioCreacion int not null,
	fechaCreacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	usuarioModificacion int null,
	fechaModificacion TIMESTAMP WITH TIME ZONE null,
	CONSTRAINT fk_usrCreacion FOREIGN KEY (usuarioCreacion) references tblusuarios(id),
	CONSTRAINT fk_usrModificacion FOREIGN KEY (usuarioModificacion) references tblusuarios(id)
);

insert into tblUsuarios (username, password, email, usuariocreacion)
values('rpineda','123456', 'rpineda@x-codec.net', 1),
('dlopez','123456', 'dlopez@x-codec.net', 1);

update tblUsuarios set 
	email='dlopez@gmail.com', 
	usuarioModificacion = 1, 
	fechaModificacion = now() ,
	isActivo = TRUE
where id=2;

-- delete from tblUsuarios where id=2;

select * from tblUsuarios;
select * from tblUsuarios where isActivo = TRUE;


CREATE TABLE IF NOT EXISTS tblNacionalidad(
	id serial primary key,
	descripcion varchar(50) not null,
	isActivo BOOLEAN NOT NULL DEFAULT TRUE,
	usuarioCreacion int not null,
	fechaCreacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	usuarioModificacion int null,
	fechaModificacion TIMESTAMP WITH TIME ZONE null,
	CONSTRAINT fk_usrCreacion FOREIGN KEY (usuarioCreacion) references tblusuarios(id),
	CONSTRAINT fk_usrModificacion FOREIGN KEY (usuarioModificacion) references tblusuarios(id)
);

insert into tblNacionalidad(descripcion, usuarioCreacion)
values('Peruana',1),
('Ecuatoriana',1),
('Venezolana',1),
('Angoleña',1);

update tblNacionalidad set
	isActivo = FALSE,
	usuarioModificacion = 1, 
	fechaModificacion = now()
where descripcion = 'Angoleña';

select * from tblNacionalidad where isactivo = true;
select * from tblNacionalidad;

CREATE TABLE IF NOT EXISTS tblSexo(
	id serial primary key,
	descripcion varchar(50) not null,
	isActivo BOOLEAN NOT NULL DEFAULT TRUE,
	usuarioCreacion int not null,
	fechaCreacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	usuarioModificacion int null,
	fechaModificacion TIMESTAMP WITH TIME ZONE null,
	CONSTRAINT fk_usrCreacion FOREIGN KEY (usuarioCreacion) references tblusuarios(id),
	CONSTRAINT fk_usrModificacion FOREIGN KEY (usuarioModificacion) references tblusuarios(id)
);

insert into tblSexo(descripcion, usuarioCreacion)
values('Macho',1),
('Hembra',1);



select * from tblSexo where isactivo = true;
select * from tblSexo;

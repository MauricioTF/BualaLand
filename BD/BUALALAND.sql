
CREATE DATABASE BUALALAND

CREATE TABLE users(
	
	idUser VARCHAR(100) NOT NULL,
	rol VARCHAR(1) NOT NULL,
	passw VARCHAR(255),
	ultimoAcceso datetime,
	tkR VARCHAR(300),

	CONSTRAINT pk_users PRIMARY KEY (idUser)
);

CREATE TABLE administrator(
	
	idAdmin VARCHAR(100) NOT NULL,
	idCompany VARCHAR(100),
	name VARCHAR(50),
	lastName1 VARCHAR(50),
	lastName2 VARCHAR (50),
	email VARCHAR(100),
	cellphone int,

	CONSTRAINT pk_users PRIMARY KEY (idAdmin),
	CONSTRAINT fk_admin_user FOREIGN KEY (idAdmin) REFERENCES users (idUser) ON DELETE CASCADE
);

CREATE TABLE employee(
	
	idEmployee VARCHAR(100) NOT NULL,
	idAdmin VARCHAR(100),
	name VARCHAR(50),
	lastName1 VARCHAR(50),
	lastName2 VARCHAR (50),
	email VARCHAR(100),
	cellphone int,
	specialty varchar(50),

	CONSTRAINT pk_users PRIMARY KEY (idEmployee),
	CONSTRAINT fk_admin_user FOREIGN KEY (idEmployee) REFERENCES users (idUser) ON DELETE CASCADE,
	CONSTRAINT fk_admin_user FOREIGN KEY (idAdmin) REFERENCES administrator (idAdmin) ON DELETE CASCADE

);

CREATE TABLE customers(
	
	idCustomers VARCHAR(100) NOT NULL,
	idEmployee VARCHAR(100) NOT NULL,
	name VARCHAR(50),
	lastName1 VARCHAR(50),
	lastName2 VARCHAR (50),
	email VARCHAR(100),
	cellphone int,
	cutsAmount int,
	points int,
	totalPoints int,


	CONSTRAINT pk_users PRIMARY KEY (idCustomers),
	CONSTRAINT fk_admin_user FOREIGN KEY (idCustomers) REFERENCES users (idUser) ON DELETE CASCADE,
	CONSTRAINT fk_admin_user FOREIGN KEY (idEmployee) REFERENCES employee (idEmployee) ON DELETE CASCADE

);


CREATE TABLE dateCut(
	
	idDate VARCHAR(100) NOT NULL,
	idCustomers VARCHAR(100) NOT NULL,
	idEmployee VARCHAR(100) NOT NULL,
	dateCut date,
	timeCut time,
	stateDate int,
	cutFree int,
	amount int,


	CONSTRAINT pk_users PRIMARY KEY (idDate),
	CONSTRAINT fk_admin_user FOREIGN KEY (idCustomers) REFERENCES customers (idCustomers) ON DELETE CASCADE,
	CONSTRAINT fk_admin_user FOREIGN KEY (idEmployee) REFERENCES employee (idEmployee) ON DELETE CASCADE

);
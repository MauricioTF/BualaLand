USE bualaland;

DELIMITER $$
--
-- Funciones
--
DROP PROCEDURE IF EXISTS searchAdministrator$$
CREATE PROCEDURE searchAdministrator ( _idAdmin varchar(100))
begin
    select * from administrator where idAdmin = _idAdmin;
end$$
DELIMITER ;

/*                 BUSCA EMPLEADO               */
DROP PROCEDURE IF EXISTS searchEmployee$$
CREATE PROCEDURE searchEmployee ( _idEmployee varchar(100))
begin
    select * from employee where idEmployee = _idEmployee;
end$$

/*               FILTRA LOS EMPLEADOS SEGUN EL ADMINISTRADOR          */
DROP PROCEDURE IF EXISTS filterByEmployee$$
CREATE PROCEDURE filterByEmployee (
_parametros varchar(250), -- %idCliente%&%nombre%&%apellido1%&%apellido2%&
    _pagina SMALLINT UNSIGNED, 
    _cantRegs SMALLINT UNSIGNED,
    _idAdmin varchar (100))
begin
    SELECT cadenaFiltro(_parametros, 'idEmployee&name&lastName1&lastName2&email') INTO @filtro;
    SELECT concat("SELECT * from employee where ", @filtro, "and idAdmin = ", _idAdmin, " LIMIT ", 
        _pagina, ", ", _cantRegs) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$

DROP FUNCTION IF EXISTS deleteEmployee$$
CREATE FUNCTION deleteEmployee (_idEmployee varchar(100)) RETURNS INT(1)
begin
    declare _cant int;
    declare _resp int;
    set _resp = 0;
    select count(idEmployee) into _cant from employee where idEmployee = _idEmployee;
    if _cant > 0 then
        set _resp = 1;
        /*select count(idCustomers) into _cant from artefacto where idCliente = _id;*/
        if _cant = 1 then
            delete from employee where idEmployee = _idEmployee;
            delete from users where idUser = _idEmployee;
        else 
            set _resp = 2;
        end if;
    end if;
    return _resp;
end$$

DROP FUNCTION IF EXISTS createEmployee$$
CREATE FUNCTION createEmployee (
    _idUser varchar(100),
    _passw varchar(255),
    _idAdmin Varchar (100),
    _name Varchar (50),
    _lastname1 Varchar (50),
    _lastname2 Varchar (50),
    _email Varchar (50),
    _cellphone int,
    _specialty varchar(50))
    RETURNS INT(1) 
begin
    declare _cant int;
    select count(idUser) into _cant from users where idUser = _idUser;
    if _cant < 1 then
    insert into users(idUser, rol, passw, ultimoAcceso, tkR) values (_idUser, '2', _passw, null, null);
    
    select count(idCustomers) into _cant from customers where idCustomers = _idUser;
    select count(idEmployee) into _cant from employee where idEmployee = _idUser;
    select count(idAdmin) into _cant from administrator where idAdmin = _idUser;    if _cant < 1 then
        insert into employee(idEmployee, idAdmin,  name, lastname1, lastname2, 
            email, cellphone, specialty) 
            values (_idUser, _idAdmin, _name, _lastname1, _lastname2, 
            _email, _cellphone, _specialty);
    end if;
    end if;
    return _cant;
end$$

DELIMITER ;
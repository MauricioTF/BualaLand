USE bualaland;

DELIMITER $$
--
-- Funciones
--
/*              BUSCA CLIENTE             */
DROP PROCEDURE IF EXISTS searchCustomer$$
CREATE PROCEDURE searchCustomer ( _idCustomer varchar(100))
begin
    select * from customers where idCustomers = _idCustomer;
end$$


/*       FILTRA CLIENTES SEGUN EL EMPLEADO           */
DROP PROCEDURE IF EXISTS filterByCustomer$$
CREATE PROCEDURE filterByCustomer (
    _parametros varchar(250), -- %idCliente%&%nombre%&%apellido1%&%apellido2%&
    _pagina SMALLINT UNSIGNED, 
    _cantRegs SMALLINT UNSIGNED,
    _idEmployee varchar (100))
begin
    SELECT cadenaFiltro(_parametros, 'idCustomers&name&lastname1&lastname2&email') INTO @filtro;
    SELECT concat("SELECT * from customers where ", @filtro, "and idEmployee = ", _idEmployee, " LIMIT ", 
        _pagina, ", ", _cantRegs) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$


/*                     NUMREG CLIENTE                */
DROP PROCEDURE IF EXISTS numRegsCustomer$$
CREATE PROCEDURE numRegsCustomer (
    _parametros varchar(250))
begin
    SELECT cadenaFiltro(_parametros, 'idCustomers&name&lastname1&lastname2&') INTO @filtro;
    SELECT concat("SELECT count(idCustomers) from customers where ", @filtro) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$


/*                      CREA CLIENTE                   */
DROP FUNCTION IF EXISTS createCustomer$$
CREATE FUNCTION createCustomer (
    _idUser varchar(100),
    _passw varchar(255),
    _idEmployee Varchar (100),
    _name Varchar (50),
    _lastname1 Varchar (50),
    _lastname2 Varchar (50),
    _email Varchar (100),
    _cellphone int,
    _cutsAmount int,
    _points int,
    _totalPoints int)
    RETURNS INT(1) 
begin
    declare _cant int;
    select count(idUser) into _cant from users where idUser = _idUser;
    if _cant < 1 then
    insert into users(idUser, rol, passw, ultimoAcceso, tkR) values (_idUser, '3', _passw, null, null);
    
    select count(idCustomers) into _cant from customers where idCustomers = _idUser;
    select count(idEmployee) into _cant from employee where idEmployee = _idUser;
    select count(idAdmin) into _cant from administrator where idAdmin = _idUser;
    if _cant < 1 then
        insert into customers(idCustomers, idEmployee, name, lastname1, lastname2, 
            email, cellphone, cutsAmount, points, totalPoints) 
            values (_idUser, _idEmployee, _name, _lastname1, _lastname2, 
            _email, _cellphone, _cutsAmount, _points, _totalPoints);
    end if;
    end if;
    return _cant;
end$$

/*                         ACTUALIZA CLIENTES                */

DROP FUNCTION IF EXISTS updateCustomer$$
CREATE FUNCTION updateCustomer (
    _idCustomers Varchar(100),
    _idEmployee Varchar (100),
    _name Varchar (50),
    _lastname1 Varchar (50),
    _lastname2 Varchar (50),
    _email Varchar (100),
    _cellphone int,
    _cutsAmount int,
    _points int,
    _totalPoints int
    ) RETURNS INT(1) 
begin
    declare _cant int;
    select count(idCustomers) into _cant from customers where idCustomers = _idCustomers;
    if _cant > 0 then
        update customers set
            idEmployee = _idEmployee,
            name = _name,
            lastname1 = _lastname1,
            lastname2 = _lastname2,
            email = _email,
            cellphone = _cellphone,
            cutsAmount = _cutsAmount,
            totalPoints = _totalPoints
        where idCustomers = _idCustomers;
    end if;
    return _cant;
end$$


/*             ELIMINA CLIENTES                  */
DROP FUNCTION IF EXISTS deleteCustomer$$
CREATE FUNCTION deleteCustomer (_idCustomer varchar(100)) RETURNS INT(1)
begin
    declare _cant int;
    declare _resp int;
    set _resp = 0;
    select count(idCustomers) into _cant from customers where idCustomers = _idCustomer;
    if _cant > 0 then
        set _resp = 1;
        /*select count(idCustomers) into _cant from artefacto where idCliente = _id;*/
        if _cant = 1 then
            delete from customers where idCustomers = _idCustomer;
            delete from users where idUser = _idCustomer;
        else 
            -- select 2 into _resp;
            set _resp = 2;
        end if;
    end if;
    return _resp;
end$$


DELIMITER ;

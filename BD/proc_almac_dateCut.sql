USE bualaland;

DELIMITER $$
--
-- Funciones
--
DROP PROCEDURE IF EXISTS searchDateCut$$
CREATE PROCEDURE searchDateCut ( _idDate varchar(100))
begin
    select * from datecut where idDate = _idDate;
end$$

/*FILTRA LAS CITAS POR CLIENTE*/
DROP PROCEDURE IF EXISTS filterBydateXcustomer$$
CREATE PROCEDURE filterBydateXcustomer (
    _parametros varchar(250), -- %idCliente%&%nombre%&%apellido1%&%apellido2%&
    _pagina SMALLINT UNSIGNED, 
    _cantRegs SMALLINT UNSIGNED,
    _idCustomers varchar (100))
begin
    SELECT cadenaFiltro(_parametros, 'idDate&dateCut&timeCut&stateDate') INTO @filtro;
    SELECT concat("SELECT * from datecut where ", @filtro, "and idCustomers = ", _idCustomers, " LIMIT ", 
        _pagina, ", ", _cantRegs) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$

/* FILTRA LAS CITAS DE CADA EMPLEADO*/
DROP PROCEDURE IF EXISTS filterByDateCut$$
CREATE PROCEDURE filterByDateCut (
    _parametros varchar(250), -- %idCliente%&%nombre%&%apellido1%&%apellido2%&
    _pagina SMALLINT UNSIGNED, 
    _cantRegs SMALLINT UNSIGNED,
    _idEmployee varchar (100))
begin

    SELECT cadenaFiltro(_parametros, 'idDate&dateCut&timeCut&stateDate&cutFree') INTO @filtro;
    SELECT concat("SELECT * from datecut where ", @filtro, "and idEmployee = ", _idEmployee, " LIMIT ", 
        _pagina, ", ", _cantRegs) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$

/*FILTRA LAS CITAS PENDIENTES PARA EL CLIENTE*/
DROP PROCEDURE IF EXISTS filterByStateDate$$
CREATE PROCEDURE filterByStateDate (
    _parametros varchar(250), -- %idCliente%&%nombre%&%apellido1%&%apellido2%&
    _pagina SMALLINT UNSIGNED, 
    _cantRegs SMALLINT UNSIGNED,
    _idCustomers varchar (100))
begin
    SELECT cadenaFiltro(_parametros, 'idDate&idCustomers&idEmployee&timeDate&cutFree') INTO @filtro;
    SELECT concat("SELECT * FROM datecut WHERE stateDate = 0 AND idCustomers = ", _idCustomers, " LIMIT ", 
        _pagina, ", ", _cantRegs) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$

/*  -----------------------------------------FIN FILTRAR -------------------------*/


/* ----------------------- */
DROP PROCEDURE IF EXISTS numRegsDateCut$$
CREATE PROCEDURE numRegsDateCut (
    _parametros varchar(250))
begin
    SELECT cadenaFiltro(_parametros, 'idDate&timeDate&stateDate&cutFree&amount&') INTO @filtro;
    SELECT concat("SELECT count(idDate) from datecut where ", @filtro) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$


/*       ACTUALIZA EL TOTAL DE PUNTOS                */
DROP FUNCTION IF EXISTS updateCustomerTotalPoints$$
CREATE FUNCTION updateCustomerTotalPoints (
    _idCustomers Varchar(100),
    _totalPoints int
    ) RETURNS INT(1) 
begin
    declare _cant int;
    select count(idCustomers) into _cant from customers where idCustomers = _idCustomers;
    if _cant > 0 then
        update customers set
            totalPoints = _totalPoints
        where idCustomers = _idCustomers;
    end if;
    return _cant;
end$$


/*                    ACTUALIZA LA CITA             */
DROP FUNCTION IF EXISTS updateDateCut$$
CREATE FUNCTION updateDateCut (
    _idDate varchar (100),
    _timeDate Datetime,
    _stateDate int,
    _amount int)
    RETURNS INT(1) 
begin
    declare _cant int;
    select count(idDate) into _cant from datecut where idDate = _idDate;
    if _cant > 0 then
        update datecut set
            timeDate = _timeDate,
            stateDate = _stateDate,
            amount = _amount
        where idDate = _idDate;
    end if;
    return _cant;
end$$

/*                     ACTUALIZA CITA DESDE CLIENTE            */
DROP FUNCTION IF EXISTS updateByClientDateCut$$
CREATE FUNCTION updateByClientDateCut (
    _idDate int,
    _date Date,
    _time Time)
    RETURNS INT(1) 
begin
    declare _cant int;
    select count(idDate) into _cant from datecut where idDate = _idDate;
    if _cant > 0 then
        update datecut set
            dateCut = _date,
            timeCut = _time
        where idDate = _idDate;
    end if;
    return _cant;
end$$

/*                    ACTUALIZA CITA DESDE EMPLEADO            */
DROP FUNCTION IF EXISTS updateByEmployeeDateCut$$
CREATE FUNCTION updateByEmployeeDateCut (
    _idDate int,
    _stateDate int,
    _amount int)
    RETURNS INT(1) 
begin
    declare _cant int;
    select count(idDate) into _cant from datecut where idDate = _idDate;
    if _cant > 0 then
        update datecut set
            stateDate = _stateDate,
            amount = _amount
        where idDate = _idDate;
    end if;
    return _cant;
end$$


/*                   ELIMINA CITA                  */
DROP FUNCTION IF EXISTS deleteDateCut$$
CREATE FUNCTION deleteDateCut (_idDate INT) RETURNS INT(1)
begin
    declare _cant int;
    declare _resp int;
    set _resp = 0;
    select count(idDate) into _cant from datecut where idDate = _idDate;
    if _cant > 0 then
        set _resp = 1;
        /*select count(idCustomers) into _cant from artefacto where idCliente = _id;*/
        if _cant = 1 then
            delete from datecut where idDate = _idDate;
        else 
            -- select 2 into _resp;
            set _resp = 2;
        end if;
    end if;
    return _resp;
end$$

/*                         CREA CTIA                   */
DROP FUNCTION IF EXISTS createDateCut$$
CREATE FUNCTION createDateCut (

    _idCustomers Varchar(100),
    _idEmployee Varchar (100),
    _dateCut Date,
    _timeCut TIME,
    _stateDate int,
    _cutFree int,
    _amount int)
    RETURNS INT(1) 
begin
    declare _cant int;
    select count(idCustomers) into _cant from dateCut where  _dateCut <= curDate();
    if _cant < 1 then
        insert into datecut( idCustomers, idEmployee, dateCut, timeCut, stateDate, cutFree, amount) 
            values (_idCustomers, _idEmployee,_dateCut, _timeCut, _stateDate, _cutFree, _amount);
    end if;
    return _cant ;
end$$


DELIMITER ;
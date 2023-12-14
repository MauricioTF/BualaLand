USE bualaland;

DELIMITER $$
DROP PROCEDURE IF EXISTS searchUsers$$
CREATE PROCEDURE searchUsers (_idUser varchar(100))
begin
    select * from users where idUser = _idUser;
end$$

DROP FUNCTION IF EXISTS createUsers$$
CREATE FUNCTION createUsers (
    _idUser Varchar(100),
    _rol int,
    _passw Varchar (255))
    RETURNS INT(1) 
begin
    declare _cant int;
    select count(idUser) into _cant from users where idUser = _idUser;
    if _cant < 1 then
        insert into users(idUser, rol, passw) 
            values (_idUser, _rol, _passw);
    end if;
    return _cant;
end$$


DROP FUNCTION IF EXISTS deleteUsers$$
CREATE FUNCTION deleteUsers (_idUser varchar(100)) RETURNS INT(1)
begin
    declare _cant int;
    select count(idUser) into _cant from users where idUser = _idUser;
    if _cant > 0 then
        delete from users where idUser = _idUser;
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS rolUsers$$
CREATE FUNCTION rolUsers (
    _idUser varchar(100), 
    _rol int
    ) RETURNS INT(1) 
begin
    declare _cant int;
    select count(idUser) into _cant from users where idUser = _idUser;
    if _cant > 0 then
        update users set
            rol = _rol
        where idUser = _idUser;
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS passwUsers$$
CREATE FUNCTION passwUsers (
    _idUser varchar(100), 
    _passw Varchar(255)
    ) RETURNS INT(1) 
begin
    declare _cant int;
    select count(idUser) into _cant from users where idUser = _idUser;
    if _cant > 0 then
        update users set
            passw = _passw
        where idUser = _idUser;
    end if;
    return _cant;
end$$
DELIMITER ;

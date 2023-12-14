use bualaland;

DELIMITER $$
DROP FUNCTION IF EXISTS ModificarToken$$
CREATE FUNCTION ModificarToken ( _idUser varchar(100), _tkR varchar(255))
RETURNS INT(1)
begin
    declare _cant int;
    select count(idUser) into _cant from users where idUser = _idUser;
    if _cant > 0 then
        update users set
                tkR = _tkR
                where idUser = _idUser;
        if _tkR <> "" then
            update users set
                ultimoAcceso = now()
                where idUser = _idUser;
        end if;
    end if;
    return _cant;
end$$
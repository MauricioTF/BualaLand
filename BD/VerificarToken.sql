
use bualaland;

DELIMITER $$
DROP PROCEDURE IF EXISTS verificarToken$$
CREATE PROCEDURE verificarToken (_idUser varchar(100), _tkR varchar(255))

begin
    select rol from users where idUser = _idUser and tkR = _tkR;
end$$
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract StudentsDatabase {
    // Estructura para almacenar la información del usuario
    struct UserInfo {
        string user;
        uint nota;
    }

    // Mapa para asociar el iduser con su información (UserInfo)
    mapping(uint => UserInfo) private students;

    // Evento para emitir cuando un usuario es agregado o actualizado
    event UserAddedOrUpdated(uint iduser, string user, uint nota);

    // Función para agregar o actualizar un usuario
    function addUser(uint _iduser, string memory _user, uint _nota) public {
        // Actualizar la información en el mapa
        students[_iduser] = UserInfo(_user, _nota);

        // Emitir el evento
        emit UserAddedOrUpdated(_iduser, _user, _nota);
    }

    // Función para recuperar la información de un usuario por su iduser
    function getUser(uint _iduser) public view returns (string memory, uint) {
        // Asegurarse de que el usuario existe
        require(bytes(students[_iduser].user).length > 0, "User does not exist.");

        // Retornar la información del usuario
        return (students[_iduser].user, students[_iduser].nota);
    }
}

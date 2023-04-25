/**
 * El objetivo de hacer esto es centralizar todos los modelos en un unico
 * archivo. Y podemos hacer esto con cualquier carpeta como lo hicimos 
 * por ejemplo con los middlewares.
 */

const Categoria = require("./categoria");
const Role = require("./role");
const Server = require("./server");
const Usuario = require("./usuario");
const Producto = require("./producto");

module.exports = {
  Categoria,
  Role,
  Server,
  Usuario,
  Producto,
};

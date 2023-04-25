// Para optimizar el codigo, si tenemos varias importaciones regadas y, por
// Ejemplo y para este caso, son varios middlewares que estan en esta
// Misma carpeta pero en archivos distintos, creamos en esta carpeta el
// Archivo index.js, que funciona como un index.html, es decir, va a ser
// El primer archivo que se va a buscar cuando hagamos referencia a esta
// Carpeta

const validaJWT = require("../middlewares/validar-jwt");
const validaRoles = require("../middlewares/validar-roles");
const validaCampos = require("../middlewares/validar-campos");

// Ahora tenemos unas constantes que contienen todo lo que exportan los
// archivos en los require. Si necesitamos exportarlas hacemos:

module.exports = {
  ...validaCampos,
  ...validaRoles,
  ...validaJWT,
};

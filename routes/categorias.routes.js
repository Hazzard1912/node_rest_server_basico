const { Router } = require("express");
const { check } = require("express-validator");
const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");
const {
  crearCategoria,
  obtenerCategorias,
  obtenerCatogoriaPorId,
  actualizarCategoria,
  borrarCategoria,
} = require("../controllers/categorias.controller");
const { existeCategoria } = require("../helpers/db-validators");

const router = Router();

// Obtener todas las categorias - publico
router.get("/", obtenerCategorias);

// Obtener una categoria por id - publico
router.get(
  "/:id",
  [
    check("id", "No es un id de Mongo valido").isMongoId(),
    check("id").custom(existeCategoria),
    validarCampos,
  ],
  obtenerCatogoriaPorId
);

// Crear categoria - privado - cualquier persona con token valido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es requerido").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

// Actualizar - privado - cualquiera con token valido
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("id").custom(existeCategoria),
    validarCampos,
  ],
  actualizarCategoria
);

// Borrar una categoria - Admin
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un id de Mongo valido").isMongoId(),
    check("id").custom(existeCategoria),
    validarCampos,
  ],
  borrarCategoria
);
module.exports = router;

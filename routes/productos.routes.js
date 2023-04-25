const { Router } = require("express");
const { check } = require("express-validator");
const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");
const {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  borrarProducto,
} = require("../controllers/productos.controller");
const { existeCategoria, existeProducto } = require("../helpers/db-validators");

const router = Router();

router.get("/", obtenerProductos);

router.get(
  "/:id",
  [
    check("id", "No es un id de Mongo valido").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos,
  ],
  obtenerProductoPorId
);

router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es requerido").not().isEmpty(),
    check("categoria", "No es un id de Mongo").isMongoId(),
    check("categoria").custom(existeCategoria),
    validarCampos,
  ],
  crearProducto
);

router.put(
  "/:id",
  [validarJWT, check("id").custom(existeProducto), validarCampos],
  actualizarProducto
);

router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un id de Mongo valido").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos,
  ],
  borrarProducto
);
module.exports = router;

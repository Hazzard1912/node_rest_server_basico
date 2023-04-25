const { Router } = require("express");
const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch,
} = require("../controllers/usuarios.controller");
const { check } = require("express-validator");
const {
  esRoleValido,
  existeEmail,
  existeUsuarioPorId,
} = require("../helpers/db-validators");

//const { validarJWT } = require("../middlewares/validar-jwt");
//const { esAdminRole, tieneRole } = require("../middlewares/validar-roles");
//const { validarCampos } = require("../middlewares/validar-campos");

// Hagamos la nueva importacion mas optima. Lo dicho, ya que esta en index.js
// No necesitamos ni siquiera dejarlo explicito, ya que va a ser el primer
// Archivo que buscara el compilador.
const {
  validarCampos,
  validarJWT,
  tieneRole,
  esAdminRole,
} = require("../middlewares");

const router = Router();

router.get("/", usuariosGet);

router.put(
  "/:id",
  [
    // Podemos tomar el id del segmento directamente desde el check

    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  usuariosPut
);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("correo", "El correo no es valido").isEmail(),
    check("correo").custom(existeEmail),
    check("password", "El password debe de ser mas de 6 letras").isLength({
      min: 6,
    }),
    check("rol").custom(esRoleValido),
    //check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    validarCampos,
  ],
  usuariosPost
);

router.delete(
  "/:id",
  [
    validarJWT,
    //esAdminRole,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDelete
);

router.patch("/", usuariosPatch);

module.exports = router;

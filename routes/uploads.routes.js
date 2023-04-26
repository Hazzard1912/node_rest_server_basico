const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { cargarArchivos } = require("../controllers/uploads.controller");

const router = Router();

router.post('/', cargarArchivos);


module.exports = router;
const { response } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    // Verificar si el email existe:
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - correo",
      });
    }

    // Si el usuario esta activo:

    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - estado: false",
      });
    }

    // Verificar la contrasenia:

    const validPassword = bcryptjs.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - Password",
      });
    }

    // Generar el JWT:

    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

const googleSignIn = async (req, res) => {
  const { id_token } = req.body;

  try {
    // sabemos que el metodo googleVerify nos retorna un objeto javascript
    // con tres propiedades: nombre, img, correo.
    // las podemos desestructurar aqui directamente
    const { nombre, img, correo } = await googleVerify(id_token);

    // Ahora podemos hacer nuestras propias validaciones.

    // creamos un usuario extrayendo de nuestra base de datos un registro
    // cuyo campo de correo sea igual al correo que acabamos de obtener de
    // la autenticacion por google sign-in
    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      // Si no existe ese registro en la base de datos entonces lo creamos!
      const data = {
        nombre,
        correo,
        password: "de google",
        img,
        google: true,
        rol: "VENTAS_ROLE",
      };

      usuario = new Usuario(data);
      // guardamos el usuario en la base de datos
      await usuario.save();
    }

    // ahora si el usuario si esta registrado en nuestra base de datos:
    if (!usuario.estado) {
      // el usuario ha sido borrado, es decir, estado = false

      return res.status(401).json({
        msg: "Hable con el administrador, usuario bloqueado",
      });
    }

    // Generamos el token de sesion
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: "El token no se pudo verificar",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};

const jwt = require("jsonwebtoken");

const Usuario = require('../models/usuario');

// Recibimos el token en los headers, usualmente en el header Authorization
const validarJWT = async(req, res, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la peticion",
    });
  }

  try {

    const { uid } = jwt.verify(token, process.env.SECRET);

    // Hacemos esto para acceder a la informacion del usuario que ha pasado
    // El filtro de tener un jwt valido, luego podemos ver el rol que
    // tiene ese usuario.
    const usuario = await Usuario.findById( uid );
 

    if (!usuario) {
        return res.status(401).json({
            msg: 'Token no valido - usuario no existe en BD'
        });
    }

    if( !usuario.estado ){
        return res.status(401).json({
            msg: 'Token no valido - estado de usuario: false'
        });
    }

    req.usuario = usuario;
    
    // A el req le podemos agregar propiedades que viajaran por todos los
    // middlewares y controladores y podemos acceder a ellos despues.
    req.uid = uid;

    next();

  } catch (error) {

    console.log(error);
    res.status(401).json({
      msg: "Token no valido",
    });
  }
};

module.exports = {
  validarJWT,
};

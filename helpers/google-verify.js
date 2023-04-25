const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function googleVerify(token = "") {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  /**
   * Cuando hacemos correctamente la verificacion, el payload que nos envia
   * google trae mucha informacion de el usuario que esta autenticandose
   * ( hacer console log del payload para verlo )
   *
   * De esto podemos desestructurar y extraer solo las propiedades que
   * necesitemos. Ya con lo necesario podemos nosotros generarle un
   * usuario a esa persona dentro de nuestra app y agregarlo a la base de
   * datos.
   */
  //const payload = ticket.getPayload();

  const { name, picture, email } = ticket.getPayload();

  // Renombramos estas propiedades a como las estamos usando en nuestro
  // Modelo de usuario de nuestra base de datos (ir a models/usuario)
  return {
    nombre: name,
    img: picture,
    correo: email,
  };
}

module.exports = {
  googleVerify,
};

const jwt = require("jsonwebtoken");

// Metodo para generar jwt que trabaja en base a promesas
const generarJWT = (uid = "") => {
  // Solo almacenaremos el uid en el payload o cuerpo del jwt
  // Para este ejemplo en particular
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: "30m",
      },
      (err, token) => { // Callback, asi no lo hacia yo.
        if (err) {
          console.log(err);
          reject("No se pudo generar el token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
  generarJWT,
};

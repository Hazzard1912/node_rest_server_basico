const path = require("path");
const { v4: uuidv4 } = require("uuid");

const subirArchivo = (
  files,
  extensionesPermitidas = ["png", "jpg", "jpeg", "gif"],
  carpeta = ""
) => {
  return new Promise((resolve, reject) => {
    const { archivo } = files;

    const nombreCortado = archivo.name.split(".");
    console.log(nombreCortado);

    const extension = nombreCortado[nombreCortado.length - 1];

    if (!extensionesPermitidas.includes(extension)) {
      return reject(
        `No se permite subir archivos con extension ${extension}, las extensiones permitas son ${extensionesPermitidas}`
      );
    }

    const nombreUnico = uuidv4() + "." + extension;
    const uploadPath = path.join(
      __dirname,
      "../uploads/",
      carpeta,
      nombreUnico
    );

    archivo.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }

      resolve(nombreUnico);
    });
  });
};

module.exports = {
  subirArchivo,
};

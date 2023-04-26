const { subirArchivo } = require("../helpers");

/**
 * En terminos generales, esta seria la logica para permitir la carga de
 * archivos como un recurso a nuestro servidor. Se pueden hacer logicamente
 * mas controles respecto a muchos factores como pueden ser el tamanio de
 * los archivos, el tipo de archivos especificos que permitiriamos subir,
 * y demas, pero en general, este es un controlador basico que permite a
 * nuestro rest-server recibir archivos.
 */
const cargarArchivos = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).json({ msg: "No hay archivos que subir" });
    return;
  }

  try {
    const nombreArchivo = await subirArchivo(req.files, undefined, 'imagenes');
    res.json({
      nombreArchivo,
    });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

module.exports = {
  cargarArchivos,
};

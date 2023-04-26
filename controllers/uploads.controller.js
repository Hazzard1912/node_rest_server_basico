const { subirArchivo } = require("../helpers");
const { validarArchivo } = require("../middlewares");
const { Usuario, Producto } = require("../models");
const path = require("path");
const fs = require("fs");

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
    const nombreArchivo = await subirArchivo(req.files, undefined, "imagenes");
    res.json({
      nombreArchivo,
    });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

const actualizarImagen = async (req, res) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No hay un producto con el id ${id}`,
        });
      }
      break;
    default:
      return res.status(500).json({ msg: "No implementado aun" });
  }

  // Limpiando imagenes previas:

  if (modelo.img) {
    // Verificar si la imagen existe en nuestro servidor:
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );
    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen);
    }
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = nombre;

  await modelo.save();
  res.json(modelo);
};

const mostrarImagen = async (req, res) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No hay un producto con el id ${id}`,
        });
      }
      break;
    default:
      return res.status(500).json({ msg: "No implementado aun" });
  }

  if (modelo.img) {
    // Verificar si la imagen existe en nuestro servidor:
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );
    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen);
    }
  }

  const pathNoImage = path.join(__dirname, "../assets/no-image.jpg");
  res.sendFile(pathNoImage);
};

module.exports = {
  cargarArchivos,
  actualizarImagen,
  mostrarImagen,
};

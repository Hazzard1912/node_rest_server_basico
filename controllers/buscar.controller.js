const { Usuario, Categoria, Producto } = require("../models");
const producto = require("../models/producto");

const coleccionesPermitidas = ["usuarios", "categorias", "productos", "roles"];
const { ObjectId } = require("mongoose").Types;

const buscarUsuarios = async (termino = "", res) => {
  const esMongoId = ObjectId.isValid(termino);

  if (esMongoId) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      results: usuario ? [usuario] : [],
    });
  }

  const regexp = new RegExp(termino, "i");

  // Usando los modificadores de consulta (mediante $ vemos las opciones)
  const usuarios = await Usuario.find({
    $or: [{ nombre: regexp }, { correo: regexp }],
    $and: [{ estado: true }],
  });

  res.json({
    results: usuarios,
  });
};

const buscarCategorias = async (termino = "", res) => {
  const esMongoId = ObjectId.isValid(termino);

  if (esMongoId) {
    const categoria = await Categoria.findById(termino);
    return res.json({
      results: categoria ? [categoria] : [],
    });
  }

  const regexp = new RegExp(termino, "i");

  const categorias = await Categoria.find({ nombre: regexp, estado: true });

  res.json({
    results: categorias,
  });
};

const buscarProductos = async (termino = "", res) => {
  const esMongoId = ObjectId.isValid(termino);

  if (esMongoId) {
    const producto = await Producto.findById(termino).populate('categoria', 'nombre');
    return res.json({
      results: producto ? [producto] : [],
    });
  }

  const regexp = new RegExp(termino, "i");

  const productos = await Producto.find({ nombre: regexp, estado: true }).populate('categoria', 'nombre');

  res.json({
    results: productos,
  });
};

const buscar = (req, res) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case "usuarios":
      buscarUsuarios(termino, res);

      break;

    case "categorias":
      buscarCategorias(termino, res);

      break;

    case "productos":
      buscarProductos(termino, res);

      break;

    case "roles":
      break;
    default:
      res.status(500).json({
        msg: "Busqueda aun no implementada",
      });
      break;
  }
};

module.exports = {
  buscar,
};

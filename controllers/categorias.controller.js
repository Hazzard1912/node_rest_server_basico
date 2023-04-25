const { Categoria } = require("../models");

const obtenerCategorias = async (req, res) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate("usuario", "nombre"),
  ]);

  res.json({
    total,
    categorias,
  });
};

const obtenerCatogoriaPorId = async (req, res) => {
  const { id } = req.params;
  const categoria = await Categoria.findById(id).populate("usuario", "nombre");

  res.json(categoria);
};

const crearCategoria = async (req, res) => {
  const nombre = req.body.nombre.toUpperCase();

  // Consultamos en nuestra base de datos si ya existe una categoria
  // con el mismo nombre
  const categoriaDB = await Categoria.findOne({ nombre });

  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre} ya existe`,
    });
  }

  // Generar la data a guardar:
  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const categoria = await new Categoria(data);

  await categoria.save();

  res.status(201).json(categoria);
};

const actualizarCategoria = async (req, res) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

  res.json(categoria);
};

const borrarCategoria = async (req, res) => {
  const { id } = req.params;
  const categoriaBorrada = await Categoria.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );
  res.status(200).json(categoriaBorrada);
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCatogoriaPorId,
  actualizarCategoria,
  borrarCategoria,
};

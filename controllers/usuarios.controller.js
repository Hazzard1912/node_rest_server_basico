const { response } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");

const usuariosGet = async (req, res = response) => {
  //const { q, nombre = "No name", apikey } = req.query;
  const { limit = 5, from = 0 } = req.query;
  const query = { estado: true };

  // De esta manera lanzamos de manera simultanea estas consultas que
  // a su vez son promesas. Es eficiente en este ejemplo ya que las dos
  // peticiones no dependen la una de la otra, luego no tiene sentido que
  // esperemos a que finalice una para comenzar la otra.

  // Desestructuramos los arreglos en el orden que los pusimos
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  // Probablemente, esa condicion que enviamos en estos metodos que
  // abstraen consultas sql hacen las veces del where donde filtramos
  // la consulta respecto a una condicion.

  res.json({ total, usuarios });
};

const usuariosPut = async (req, res = response) => {
  const id = req.params.id;
  const { _id, password, google, correo, ...info } = req.body;

  // Validar contra base de datos:
  if (password) {
    const saltRounds = bcryptjs.genSaltSync();
    info.password = bcryptjs.hashSync(password, saltRounds);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, info);

  res.json(usuario);
};

const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  const saltRounds = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, saltRounds);

  await usuario.save();

  res.json(usuario);
};

const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;

  // Borrando fisicamente (No es recomendado)
  //const usuario = await Usuario.findByIdAndDelete(id);

  // Cambiando estado del usuario para evitar la posible integridad 
  // referencial, por lo tanto eliminar en realidad es un update.
  const usuario = await Usuario.findByIdAndUpdate( id, {estado: false});

  res.json(usuario);
};

// Hemos finalizado una api rest, conectada a base de datos y con todo su
// CRUD definido.

const usuariosPatch = (req, res = response) => {
  res.json({ message: "patch api - controlador" });
};

module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch,
};

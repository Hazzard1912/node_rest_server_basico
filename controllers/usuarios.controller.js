const { response } = require("express");

const usuariosGet = (req, res = response) => {

  const { q, nombre = 'No name', apikey } = req.query;

  res.json({ message: "get api - controlador", q, nombre, apikey });
};

const usuariosPut = (req, res = response) => {

  const id = req.params.id;

  res.json({ message: "put api - controlador", id });
};

const usuariosPost = (req, res = response) => {
  const { nombre, edad } = req.body;
  res.json({ message: "post api - controlador", nombre, edad });
};

const usuariosDelete = (req, res = response) => {
  res.json({ message: "delete api - controlador" });
};

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

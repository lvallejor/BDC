const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.USER,
  host: "localhost",
  password: process.env.PASSWORD,
  database: "bancodigital",
  port: 5432,
});

const insertarUsuario = async (nombre, correo, rut, direccion, clave) => {
  try {
    const result = await pool.query(
      "INSERT INTO usuarios (nombre, correo, rut, direccion, clave) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [nombre, correo, rut, direccion, clave]
    );
    return result.rows;
  } catch (error) {
    console.log(error);
  }
};

const getUser = async (correo, clave) => {
  const result = await pool.query("SELECT * FROM usuarios where correo = $1", [
    correo,
  ]);
  return result.rows[0];
};

module.exports = { insertarUsuario, getUser };

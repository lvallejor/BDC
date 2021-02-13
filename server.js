//Importaciones
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");

const app = express();

const { insertarUsuario } = require("./consultas");

//Configuraciones
app.set("view engine", "handlebars");
app.engine(
  "handlebars",
  exphbs({
    layoutsDir: __dirname + "/views",
    partialsDir: __dirname + "/views/components",
  })
);
secretKey = "Prueba";
app.set("port", process.env.PORT || 3000);

//Midlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));

//Rutas
app.get("/sesion", (req, res) => {
  res.render("IniciarSesion", { layout: "IniciarSesion" });
});

app.get("/registro", (req, res) => {
  res.render("Registro", { layout: "Registro" });
});

app.get("/bienvenida", (req, res) => {
  res.render("Bienvenida", { layout: "Bienvenida" });
});

app.post("/registro", async (req, res) => {
  const { nombre, correo, rut, direccion, clave } = req.body;
  const dataUsuario = await insertarUsuario(
    nombre,
    correo,
    rut,
    direccion,
    clave
  );
  dataUsuario
    ? res.redirect("/bienvenida")
    : res.send(
        `<script>alert("Datos incorrectos, vuelva a intentar")</script>`
      );
});

//Starting de server
app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});

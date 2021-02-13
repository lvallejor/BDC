//Importaciones
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");

const app = express();

const { insertarUsuario, getUser } = require("./consultas");

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
    ? res.render("Bienvenida", { layout: "Bienvenida", nombre })
    : res.send(
        `<script>alert("Datos incorrectos, vuelva a intentar")</script>`
      );
});

app.post("/verify", async (req, res) => {
  const { correo, clave } = req.body;
  const user = await getUser(correo, clave);
  let token = user ? jwt.sign(user, secretKey) : false;
  user
    ? res.redirect("/Transferencias?token=" + token)
    : res.send("No existe este usuario en nuestra base de datos");

  res.send();
});

app.get("/Transferencias", (req, res) => {
  const { token } = req.query;

  jwt.verify(token, secretKey, (err, payload) => {
    err
      ? res.status(401).send({ error: "401 No Autorizado", message: err })
      : res.render("Transferencias", {
          layout: "Transferencias",
          nombre: payload.nombre,
        });
  });
});

app.get("/newTransfer", (req, res) => {
  res.render("NuevaTransferencia", { layout: "NuevaTransferencia" });
});
//Starting de server
app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});

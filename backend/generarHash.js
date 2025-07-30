// generarHash.js
const bcrypt = require("bcrypt");

const generarHash = async () => {
  const contrasena = "Admin"; // Cambia por la que quieras hashear
  const hash = await bcrypt.hash(contrasena, 10);
  console.log("Contraseña original:", contrasena);
  console.log("Hash:", hash);
};

generarHash();

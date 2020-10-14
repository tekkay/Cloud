const escapeHtml = require("escape-html");
const Firestore = require("@google-cloud/firestore");

exports.helloHttp = (req, res) => {
  res.send(`Hello ${escapeHtml(req.query.name || req.body.name || "World")}!`);
};

exports.saveCars = async (req, res) => {
  const { placa, cor, preco, carModel, marca } = req.query;

  if (!placa || !cor || !preco || !carModel || !marca) {
    res.send("Bad Request");
    throw new Error("Bad Request");
  }

  const db = new Firestore({
    projectId: "cars-292423",
    keyFilename: "./cars-292423-42b8e124326b.json",
  });

  const response = await db.collection("cars").add({
    placa,
    cor,
    preco,
    carModel,
    marca,
  });

  res.send(`The content has been saved with ID: ${response.id}.`);
};

exports.getCars = async (req, res) => {
  const placa = req.query.placa;

  if (!placa) {
    res.send("Bad Request");
    throw new Error("Bad Request");
  }

  const db = new Firestore({
    projectId: "cars-292423",
    keyFilename: "./cars-292423-42b8e124326b.json",
  });

  const carsRef = db.collection("cars");
  const snapshot = await carsRef.where("placa", "==", placa).get();

  if (snapshot.empty) {
    res.send("No matching documents.");
    return;
  }

  snapshot.forEach((doc) => {
    res.send(JSON.stringify(doc.data()));
  });
};

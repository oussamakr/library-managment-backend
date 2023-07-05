const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
require("./ConnectDB/connection_Mdb");
app.use(express.urlencoded({ extended: true }));

const cors = require("cors");
const morgan = require("morgan");

const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "10mb" }));
app.use(
  cors({
    origin: "http://localhost:3000", // Remplacez par l'URL de votre application React
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

const admin_route = require("./Routes/admin_Route");
const client_route = require("./Routes/client_Route");
const categorie_route = require("./Routes/categorie_Route");
const telecharegemnt_route = require("./Routes/telechargement_Route");
const refresh_token = require("./Routes/Refresh_Route");

const dotenv = require("dotenv");
dotenv.config();

app.use(
  cors({
    origin: "http://localhost:3000", // Remplacez par l'URL de votre application React
    credentials: true,
  })
);
app.use("/uploads", express.static("uploads"));
app.use(morgan("dev"));

//Routes
app.use("/admin_api", admin_route);
app.use("/client_api", client_route);
app.use("/categorie_api", categorie_route);
app.use("/telechargement_api", telecharegemnt_route);

app.use("/refresh", refresh_token);

const port = process.env.port || 5000;
app.listen(port, () => {
  console.log("server on listen dans le port " + port);
});

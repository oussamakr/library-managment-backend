const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.Verify_JWT = (req, res, next) => {
  const authheader = req.headers["authorization"];
  if (!authheader) return res.sendStatus(401);

  const token = authheader.split(" ")[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    { complete: true },
    (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(403).send({ message: err.message });
      }

      // Vérification de l'expiration du token
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.payload.exp < currentTimestamp) {
        return res.status(401).send({ message: "Access token expired" });
      } else if (decoded.payload.role !== "admin") {
        return res
          .status(401)
          .send({ message: "client operation Unauthorized" });
      }

      // return res.send({ message: "success" });
      else {
        next();
      }
    }
  );
};

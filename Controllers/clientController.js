const User = require("../Models/Model_Utilisateur");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.login = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    if (!email || !motDePasse) {
      return res.status(400).json({ message: "email and password required" });
    }

    const existing_email = await User.findOne({ email });

    if (!existing_email) {
      return res.status(400).json({ message: "Wrong email or password" });
    }

    const compare_hash_password = await bcrypt.compare(
      motDePasse,
      existing_email.motDePasse
    );

    if (!compare_hash_password) {
      return res.status(400).json({ message: "Wrong email or password" });
    }

    const data = {
      userId: existing_email._id,
      type: existing_email.type,
    };
    const time_expire = 10800;
    const accessTokenExpiration = Math.floor(Date.now() / 1000) + time_expire;
    console.log("temps " + accessTokenExpiration);
    const accesstoken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: `${time_expire}s`,
    });

    const refreshtoken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    const save_info_log = await User.findByIdAndUpdate(
      existing_email._id,
      { refreshtoken },
      { new: true }
    );

    res.cookie("refreshToken", refreshtoken, { httpOnly: true });
    res.cookie("time_expire", accessTokenExpiration, { httpOnly: true });

    return res.send({
      message: "Access token created",
      accesstoken,
      refreshtoken,
      accessTokenExpiration,
      user_Data: existing_email,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

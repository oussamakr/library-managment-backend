const User = require("../Models/Model_Utilisateur");
const jwt = require("jsonwebtoken");

require("dotenv").config();

exports.Refrech_token = async (req, res) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.refreshToken) {
      return res.sendStatus(409);
    }

    const refresh_token = cookies.refreshToken;
    console.log("frfrffr" + refresh_token);
    const user_found = await User.findOne({ refreshtoken: refresh_token });
    console.log("ffff" + user_found);
    if (!user_found || !user_found._id) {
      return res.sendStatus(401);
    }

    jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || user_found._id != decoded.userId) {
          return res.sendStatus(403);
        }
        const time_expire = 10800;
        const accessTokenExpiration =
          Math.floor(Date.now() / 1000) + time_expire;
        const accesstoken = jwt.sign(
          { userId: decoded.userId, role: decoded.role },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: `${time_expire}s` }
        );

        res.header("Access-Control-Allow-Credentials", true);
        res.cookie("time_expire", accessTokenExpiration, { httpOnly: true });
        res
          .status(200)
          .json({ accesstoken: accesstoken, accessTokenExpiration });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

import jwt from 'jsonwebtoken';
import users from "../models/user.js"


const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401); /* If there is no cookie or no JWT cookie status 401 Unauthorized */
  
  const refreshToken = cookies.jwt;
  console.log(refreshToken);

  const findUser = await users.findOne({ refreshToken }).exec();
  console.log(findUser)
  if (!findUser) return res.json("Error before verify").sendStatus(403); /* If there is no user with such valid refresh cookie on database status 403 Forbidden  */
  

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err /* || findUser._id !== decoded._id */) return res.json("Error ON VERIFY").sendStatus(403);
      const roles = Object.values(findUser.roles);
      const accessToken = jwt.sign(
        {
          "UserInfo": {
            "id": decoded._id,
            "roles": roles
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );
      console.log(decoded._id);
      console.log(findUser._id)
      res.json({ roles, accessToken })
    }
  );
}

export default handleRefreshToken;
import { expressjwt } from "exporess-jwt";

const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithems: ["HS256"],
  requestProperty: "user",
});

const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithems: ["HS256"],
  getToken: (req) => req.cokies.refreshToken,
});

export default {
  verifyAccessToken,
  verifyRefreshToken,
};

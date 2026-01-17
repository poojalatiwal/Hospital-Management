export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
  const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";

  const cookieExpire = process.env.COOKIE_EXPIRE || 7; // ✅ fallback

  res.status(statusCode).cookie(cookieName, token, {
    expires: new Date(Date.now() + cookieExpire * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "lax",
  }).json({
    success: true,
    message,
    user,
    token
  });
};

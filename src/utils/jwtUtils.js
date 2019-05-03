import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET
const expiresIn = '7 days'

const getToken = (userId) => {
  return jwt.sign({
    userId
  }, jwtSecret, {
    expiresIn
  });
}

const checkToken = (token) => {
  return jwt.verify(token, jwtSecret)
}

const generateToken = (length) => {
  var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
  var b = [];
  for (var i = 0; i < length; i++) {
    var j = (Math.random() * (a.length - 1)).toFixed(0);
    b[i] = a[j];
  }
  return b.join("");
}

export {
  getToken,
  checkToken,
  generateToken
}
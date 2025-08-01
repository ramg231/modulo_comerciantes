import jwt from 'jsonwebtoken';
export const generarJWT = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      { expiresIn: '2h' },
      (err, token) => {
        if (err) {
          console.error('Error al generar el token:', err);
          reject('No se pudo generar el token');
        }
        resolve(token);
      }
    );
  });
};
 
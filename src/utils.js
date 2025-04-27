import bcrypt from "bcrypt";
import passport from "passport";

export const generateHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        res
          .status(401)
          .send({ error: info.messages ? info.messages : info.toString() });
        return;
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).send({ message: "No autorizado" });
    if (req.user.role != role)
      return res.status(403).send({ error: "No tienes permiso" });
    next();
  };
};
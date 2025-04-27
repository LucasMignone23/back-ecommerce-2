import { Router } from "express";
import userService from "../models/user.model.js";
import { isValidPassword } from "../utils.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const router = Router();

// Registro de usuario
router.post("/", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  if (!first_name || !last_name || !email || !age || !password) {
    return res.status(400).json({ message: "Faltan datos" });
  }
  try {
    const userExist = await userService.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const newUser = new userService({
      first_name,
      last_name,
      email,
      age,
      password,
    });
    await newUser.save();
    res.status(201).send({ message: "Usuario registrado exitosamente", user: newUser });
  } catch (error) {
    res.status(400).send({ message: "Error al registrar el usuario", error });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const user = await userService.findOne({ email });
    if (!user || !isValidPassword(user, password)) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { email: user.email, role: user.role },
      config.jwtPrivateKey,
      { expiresIn: config.jwtExpiresIn }
    );

    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    res.status(400).send({ message: "Error al iniciar sesión", error });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Sesión cerrada exitosamente" });
});

export default router;

const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { tbl_cuentas } = require('../models');
const sendEmail = require('../services/emailService');
const router = express.Router();
const { ListItems } = require('../models');

// Ruta de registro
router.post('/register', async (req, res) => {
  const { Correo, Contrasena, PreguntaSecreta, Respuesta } = req.body;

  try {
    // Verificar que todos los campos requeridos están presentes
    if (!Correo || !Contrasena || !PreguntaSecreta || !Respuesta) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Generar hash de la contraseña
    const hashedPassword = await bcrypt.hash(Contrasena, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await tbl_cuentas.create({
      Correo,
      Contrasena: hashedPassword,
      PreguntaSecreta,
      Respuesta,
      verificationToken,
      isVerified: false, // Inicialmente no verificado
      FRegistro: new Date() // Fecha de registro actual
    });

    const verificationLink = `http://localhost:3000/api/auth/verify?token=${verificationToken}`;
    sendEmail(Correo, 'Verifica tu cuenta', `Haz clic en el siguiente enlace para verificar tu cuenta: ${verificationLink}`);

    res.status(201).json({ message: 'Usuario registrado. Revisa tu correo electrónico para verificar tu cuenta.' });
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    res.status(500).json({ error: 'Error al registrar usuario', details: err.message });
  }
});

// Ruta de verificación
router.get('/verify', async (req, res) => {
  const { token } = req.query;

  try {
    const user = await tbl_cuentas.findOne({ where: { verificationToken: token } });

    if (!user) {
      return res.status(404).json({ error: 'Token no válido' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: 'Cuenta verificada con éxito' });
  } catch (err) {
    console.error('Error al verificar usuario:', err);
    res.status(500).json({ error: 'Error al verificar usuario', details: err.message });
  }
});

// Ruta de login
router.post('/login', async (req, res) => {
  const { Correo, Contrasena } = req.body;

  console.log('Intento de login:', Correo);

  try {
    if (!Correo || !Contrasena) {
      return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    }

    const user = await tbl_cuentas.findOne({ where: { Correo } });

    if (!user || !user.isVerified) {
      return res.status(401).json({ error: 'Usuario no encontrado o no verificado' });
    }

    const match = await bcrypt.compare(Contrasena, user.Contrasena);

    if (!match) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    res.status(200).json({ message: 'Inicio de sesión exitoso' });
  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    res.status(500).json({ error: 'Error al iniciar sesión', details: err.message });
  }
});

// Ruta para obtener preguntas secretas
router.get('/preguntasSecretas', async (req, res) => {
  try {
    const preguntas = await ListItems.findAll({
      where: {
        ListID: 7, // Usamos ListID = 7 para obtener solo las preguntas secretas
      },
      attributes: ['ListItem', 'ListDescription'],
    });

    res.status(200).json(preguntas);
  } catch (err) {
    console.error('Error al obtener las preguntas secretas:', err);
    res.status(500).json({ message: 'Error al obtener las preguntas secretas', error: err.message });
  }
});

// Ruta para obtener la pregunta secreta específica de un usuario
router.post('/get-secret-question', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await tbl_cuentas.findOne({
      where: { Correo: email },
      attributes: ['PreguntaSecreta'],
    });

    if (user) {
      res.status(200).json({ question: user.PreguntaSecreta });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (err) {
    console.error('Error al obtener la pregunta secreta:', err);
    res.status(500).json({ message: 'Error al obtener la pregunta secreta', error: err.message });
  }
});


// Ruta para verificar la respuesta y cambiar la contraseña
router.post('/verify-answer', async (req, res) => {
  const { email, answer, newPassword } = req.body; // Datos recibidos desde el frontend

  try {
    const user = await tbl_cuentas.findOne({
      where: { Correo: email },
      attributes: ['Respuesta'], // Solo necesitamos verificar la respuesta
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Compara la respuesta proporcionada por el usuario con la guardada en la base de datos
    if (user.Respuesta === answer) {
      // Si la respuesta es correcta, cambia la contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.Contrasena = hashedPassword;
      await user.save();

      res.status(200).json({ message: 'Contraseña cambiada exitosamente' });
    } else {
      res.status(401).json({ message: 'Respuesta incorrecta' });
    }
  } catch (err) {
    console.error('Error al verificar la respuesta:', err);
    res.status(500).json({ message: 'Error al verificar la respuesta', error: err.message });
  }
});

// Ruta para obtener perfil de usuario (nombre e imagen)
router.get('/profile', async (req, res) => {
  const { email } = req.query;

  try {
    const user = await tbl_cuentas.findOne({
      where: { Correo: email },
      attributes: ['Correo', 'profileImage'] // Obtiene el correo y la imagen de perfil
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({
      email: user.Correo,
      profileImage: user.profileImage,  // Envía la imagen de perfil guardada
    });
  } catch (err) {
    console.error('Error al obtener el perfil del usuario:', err);
    res.status(500).json({ message: 'Error al obtener el perfil del usuario', error: err.message });
  }
});


// Ruta para actualizar la imagen de perfil del usuario
router.post('/upload-profile-image', async (req, res) => {
  const { email, profileImage } = req.body;

  try {
    const user = await tbl_cuentas.findOne({ where: { Correo: email } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.profileImage = profileImage;  // Actualiza el campo de imagen
    await user.save();

    res.status(200).json({ message: 'Imagen de perfil actualizada exitosamente' });
  } catch (err) {
    console.error('Error al actualizar la imagen de perfil:', err);
    res.status(500).json({ message: 'Error al actualizar la imagen de perfil', error: err.message });
  }
});




module.exports = router;

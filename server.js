const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const connection = require('./db'); // Importa el módulo de conexión de la base de datos

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:8100',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,  // Permitir el envío de credenciales
}));


// Middleware para manejar JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de autenticación
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Manejo de errores genérico
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal. Intenta de nuevo más tarde.');
});

// Sincroniza la base de datos y empieza el servidor
connection.query('SELECT 1', (err) => {
  if (err) {
    console.error('Error al sincronizar la base de datos:', err);
    return;
  }

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
});

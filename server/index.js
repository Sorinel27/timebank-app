require('dotenv').config(); // Citeste fisierul .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Ne permite sa primim JSON de la frontend

// Conectare la MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conexiune reușită la MongoDB!'))
  .catch((err) => console.error('❌ Eroare conectare MongoDB:', err));

// Rute de test
app.get('/', (req, res) => {
    res.send('API-ul TimeBank funcționează și e conectat la DB!');
});

// Pornire Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Serverul rulează pe portul ${PORT}`);
});
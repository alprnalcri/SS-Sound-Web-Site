// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

// Express uygulamasını başlat
const app = express();

// Middleware'ler
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.static('public'));

// API Rotaları
const eventRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const galleryRoutes = require('./routes/gallery');
const contentRoutes = require('./routes/content');
const contactRoutes = require('./routes/contact');

app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/contact', contactRoutes);

// Üretim ortamı için frontend yönlendirmesi
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '../client/build');
  app.use(express.static(clientPath));

  // Tüm diğer istekleri React'ın index.html'ine yönlendir
  app.use((req, res) => {
    res.sendFile(path.resolve(clientPath, 'index.html'));
  });
}

// MongoDB bağlantısı
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB bağlantısı başarılı!');
  } catch (error) {
    console.error('❌ MongoDB bağlantı hatası:', error);
    process.exit(1);
  }
};

// Test rotası
app.get('/', (req, res) => {
  res.json({ message: 'Akord Organizasyon API çalışıyor 🚀' });
});

// Port ayarı
const PORT = process.env.PORT || 5000;

// Sunucuyu başlat
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🌐 Sunucu ${PORT} portunda çalışıyor...`);
  });
});

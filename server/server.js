const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

// Express uygulamasını başlat
const app = express();

// Gerekli middleware'ler
app.use(cors()); // Farklı portlardaki client ve server arasında iletişimi sağlar
app.use(express.json()); // Gelen JSON verilerini parse eder

// Yüklenen dosyalara public erişim için
app.use(express.static('public'));

// API Rotaları
const eventRoutes = require('./routes/events');
app.use('/api/events', eventRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const uploadRoutes = require('./routes/upload');
app.use('/api/upload', uploadRoutes);

const galleryRoutes = require('./routes/gallery');
app.use('/api/gallery', galleryRoutes);

const contentRoutes = require('./routes/content');
app.use('/api/content', contentRoutes);

const contactRoutes = require('./routes/contact');
app.use('/api/contact', contactRoutes);

// Üretim ortamı için eklendi
const path = require('path');

// Üretim ortamında static dosyaları sun
if (process.env.NODE_ENV === 'production') {
  // Client'ın build klasörünü statik olarak sun
  app.use(express.static(path.join(__dirname, '../client/build')));

  // API rotaları dışındaki tüm istekleri client'ın index.html'ine yönlendir
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// MongoDB bağlantısı
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB bağlantısı başarılı!');
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error);
    process.exit(1); // Hata durumunda uygulamayı kapat
  }
};

// Basit bir test rotası
app.get('/', (req, res) => {
  res.json({ message: 'Akord Organizasyon API sunucusu çalışıyor.' });
});

// Portu belirle (önce .env dosyasından, bulamazsa 5000'i kullan)
const PORT = process.env.PORT || 5000;

// Sunucuyu dinlemeye başla
// Önce veritabanına bağlan, sonra sunucuyu başlat
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor...`);
  });
});
module.exports = {
  apps: [
    {
      name: 'nestjs-app',          // Uygulamanız için belirlediğiniz isim
      script: './dist/main.js',    // Derlenmiş dosyanızın yolu
      instances: 1,                // İstediğiniz instance sayısı (cluster modu için "0" kullanabilirsiniz)
      autorestart: true,           // Uygulama çökse otomatik yeniden başlatma
      watch: true,                // Değişiklik izleme, ihtiyacınıza göre açabilirsiniz
      max_memory_restart: '3G',  // Bellek limiti aşıldığında yeniden başlatma
      env: {
        NODE_ENV: 'development',   // Varsayılan ortam değişkenleri
      },
      env_production: {
        NODE_ENV: 'production',    // Production ortamı için değişkenler
      },
    },
  ],
};


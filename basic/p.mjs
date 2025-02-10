// Milisaniye cinsinden Unix timestamp
const msTimestamp = 1739196238959;

// Date nesnesine dönüştürme (timestamp saniye cinsinden değil, milisaniye cinsinden verildiği için direkt kullanabiliriz)
const date = new Date(msTimestamp);

// Tarihi varsayılan formatta (sistem ayarlarınıza göre) yazdırma
console.log("Varsayılan Tarih:", date.toString());

// Türkiye yerel ayarlarında okunabilir tarih formatı (örn. "10.02.2025, 20:17:18")
console.log("Yerel Tarih (tr-TR):", date.toLocaleString("tr-TR"));

// İsteğe bağlı: Tarihi özel formatta (YYYY-MM-DD HH:MM:SS) yazdırma
const year   = date.getFullYear();
const month  = (date.getMonth() + 1).toString().padStart(2, '0'); // Aylar 0'dan başlar, bu yüzden +1
const day    = date.getDate().toString().padStart(2, '0');
const hour   = date.getHours().toString().padStart(2, '0');
const minute = date.getMinutes().toString().padStart(2, '0');
const second = date.getSeconds().toString().padStart(2, '0');

const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
console.log("Özel Formatlı Tarih:", formattedDate);

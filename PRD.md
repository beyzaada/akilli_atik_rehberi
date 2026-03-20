# PRD — Akıllı Atık Rehberi
**Product Requirements Document · v1.0**
Hazırlayan: Kıdemli Full Stack Developer
Tarih: Mart 2026

---

## 1. Genel Bakış

### 1.1 Ürün Nedir?

**Akıllı Atık Rehberi**, kullanıcının elindeki ambalaj veya atık malzemesini yazıya dökerek yapay zekâdan anında geri dönüşüm talimatı aldığı, tek sayfalık (SPA) bir web uygulamasıdır.

### 1.2 Neden Yapıyoruz?

"Biyobozunur" veya "kompostlanabilir" yazan ambalajların büyük çoğunluğu yalnızca endüstriyel tesislerde bozunabiliyor. Tüketici ise hangi atığı hangi kutuya atacağını bilemiyor. Bu uygulama o bilgi boşluğunu kapatır.

### 1.3 Kapsam (Scope)

| Kapsam İçi | Kapsam Dışı |
|---|---|
| Tek sayfalık web arayüzü | Mobil uygulama (iOS / Android) |
| Metin tabanlı AI analizi | Görüntü / fotoğraf tanıma |
| 3 kategori renk kodu | Kullanıcı hesabı / geçmiş sorgular |
| Türkçe arayüz | Çok dil desteği |

---

## 2. Kullanıcı Hikâyesi

> Zeynep, marketten aldığı "biyobozunur PLA çatal"ı elinde tutuyor. Onu kompost kutusuna mı atsın, plastik kutusuna mı? Bilmiyor. Telefonu ile **Akıllı Atık Rehberi'ni** açıyor, "PLA çatal" yazıyor, Analiz Et'e basıyor. 3 saniyede sarı kart çıkıyor: **"Endüstriyel Kompost Tesisi Gerektirir."** İki maddelik talimatı okuyor, doğru kutuya atıyor.

---

## 3. Kullanıcı Akışı (User Flow)

```
Kullanıcı sayfayı açar
        │
        ▼
Arama çubuğuna atık türünü yazar
        │
        ▼
"Analiz Et" butonuna basar
        │
        ▼
Yükleniyor animasyonu gösterilir
        │
        ▼
AI API yanıt döner
        │
   ┌────┴─────┐
Başarılı     Hata
   │             │
   ▼             ▼
Sonuç kartı   Hata mesajı
gösterilir    gösterilir
```

---

## 4. Ekranlar ve UI Bileşenleri

### 4.1 Ana Ekran (Arama Durumu)

Sayfa tek bir ekrandan ibarettir. İki durumu vardır: **Arama** ve **Sonuç**.

**Arama durumunda ekranda şunlar bulunur:**

- Üstte küçük logo / başlık: `Akıllı Atık Rehberi`
- Kısa bir alt başlık / slogan (örn. `Atığını yaz. Doğru kutuyu öğren.`)
- Büyük, ortalanmış bir **metin giriş alanı** (placeholder: `"Örn: Biyobozunur PLA çatal"`)
- Giriş alanının sağında veya altında **"Analiz Et"** butonu
- Arka plan: beyaz veya açık yeşil tonlu, minimal, temiz

### 4.2 Sonuç Kartı (Analiz Durumu)

Kullanıcı sorguladıktan sonra arama alanının altında **Sonuç Kartı** belirir.

Kart şu öğeleri içerir:

| Öğe | Açıklama |
|---|---|
| **Renk bandı** | Kartın üst kenarı veya arka planı renk koduyla boyanır |
| **İkon** | Kategoriye uygun büyük ikon (♻️ / 🌿 / 🗑️) |
| **Kategori etiketi** | `GERİ DÖNÜŞÜR`, `ENDÜSTRİYEL KOMPOST`, `ÇÖPE ATILIR` |
| **Kısa açıklama** | 1–2 cümle: neden bu kategori? |
| **Eylem adımları** | 2–3 maddeli, `•` ile ayrılmış net talimatlar |
| **"Yeni Sorgula" butonu** | Kartı sıfırlar, arama alanına döner |

### 4.3 Renk Kodu Sistemi

| Renk | Etiket | Anlamı |
|---|---|---|
| 🟢 Yeşil | GERİ DÖNÜŞÜR | Standart plastik / kağıt geri dönüşümüne gider |
| 🟡 Sarı | ENDÜSTRİYEL KOMPOST | Belediye kompost tesisi gerektirir, ev kompostuna gitmez |
| 🔴 Kırmızı | ÇÖPE ATILIR | Geri dönüştürülemiyor, doğada bozunmuyor |

### 4.4 Hata Durumları

| Durum | Gösterilecek Mesaj |
|---|---|
| Boş sorgu | `"Lütfen bir malzeme adı girin."` |
| AI API yanıt vermedi | `"Şu an analiz yapılamıyor, lütfen tekrar deneyin."` |
| Tanımsız malzeme | Gri kart: `"Bu malzeme hakkında yeterli veri bulunamadı."` |

---

## 5. Teknik Gereksinimler

### 5.1 Teknoloji Seçimi

| Katman | Teknoloji | Gerekçe |
|---|---|---|
| **Frontend** | HTML + Vanilla JS veya React (tek dosya) | Hızlı kurulum, sıfır bağımlılık karmaşası |
| **Stil** | Tailwind CSS (CDN) | Temiz, hızlı, özelleştirilebilir |
| **AI Entegrasyonu** | Anthropic Claude API (`/v1/messages`) | Yapılandırılmış analiz ve renk kategorisi çıktısı için |
| **Backend** | Node.js + Express (minimal) VEYA Vercel Edge Function | API anahtarını gizlemek için zorunlu; tarayıcıdan direkt API çağrısı yapılmaz |
| **Hosting** | Vercel veya Netlify | Ücretsiz, tek tıkla deploy |

> ⚠️ **Kritik:** AI API anahtarı (secret key) hiçbir zaman frontend koduna yazılmaz. Tüm API çağrıları backend üzerinden yapılır.

### 5.2 API Entegrasyonu

**İstek akışı:**

```
Tarayıcı (Frontend)
    │  POST /api/analyze
    │  { "query": "PLA çatal" }
    ▼
Backend (Edge Function / Express)
    │  POST https://api.anthropic.com/v1/messages
    │  Authorization: Bearer ANTHROPIC_API_KEY
    ▼
Claude API
    │  JSON yanıt döner
    ▼
Backend → Frontend
    {
      "category": "industrial_compost",
      "color": "yellow",
      "label": "Endüstriyel Kompost Gerektirir",
      "explanation": "PLA plastikler yalnızca 60°C üzeri...",
      "steps": [
        "Belediye kompost noktasına götürün.",
        "Ev kompostuna atmayın.",
        "Diğer plastiklerle karıştırmayın."
      ]
    }
```

**Claude'a gönderilecek sistem prompt'u (örnek):**

```
Sen bir atık ve malzeme uzmanısın. Kullanıcının verdiği ambalaj veya 
malzeme adını analiz et. Yanıtını YALNIZCA aşağıdaki JSON formatında ver, 
başka hiçbir şey yazma:

{
  "category": "recyclable" | "industrial_compost" | "trash" | "unknown",
  "color": "green" | "yellow" | "red" | "gray",
  "label": "kısa kategori etiketi (Türkçe)",
  "explanation": "1-2 cümle açıklama (Türkçe)",
  "steps": ["adım 1", "adım 2", "adım 3"]
}
```

### 5.3 Performans Hedefleri

| Metrik | Hedef |
|---|---|
| Sayfa ilk yüklenme süresi | < 1.5 saniye |
| AI API yanıt süresi | < 5 saniye |
| Lighthouse Performans skoru | ≥ 85 |
| Mobil uyumluluk | Tam responsive (375px – 1440px) |

---

## 6. Dosya ve Klasör Yapısı

```
akilli-atik-rehberi/
├── public/
│   └── index.html          ← Tek sayfa, tüm UI burada
├── api/
│   └── analyze.js          ← Backend endpoint (Vercel Edge Function)
├── src/
│   ├── main.js             ← Frontend JS mantığı
│   └── style.css           ← Özel stiller (Tailwind üstü)
├── .env                    ← API anahtarı (git'e eklenmez!)
├── .gitignore              ← .env satırı mutlaka burada
├── vercel.json             ← Routing konfigürasyonu
└── README.md               ← Kurulum talimatları
```

---

## 7. Güvenlik Gereksinimleri

- `ANTHROPIC_API_KEY` yalnızca `.env` dosyasında saklanır ve sunucu tarafında okunur.
- `.env` dosyası `.gitignore`'a eklenir, Git'e asla commit edilmez.
- Frontend JS dosyaları API anahtarı içermez.
- Kullanıcı girdisi backend'de uzunluk kontrolünden geçirilir (max 200 karakter).
- Rate limiting: aynı IP'den dakikada en fazla 10 istek kabul edilir (isteğe bağlı, temel seviye).

---

## 8. Geliştirme Aşamaları (Milestone)

### Aşama 1 — Statik Prototip *(1-2 gün)*
- [ ] HTML + CSS ile arama ekranı tasarımı tamamlanır
- [ ] Sahte (mock) JSON verisiyle sonuç kartı gösterilir
- [ ] Renk kodu sistemi ve responsive tasarım doğrulanır

### Aşama 2 — AI Entegrasyonu *(1-2 gün)*
- [ ] Backend endpoint (`/api/analyze`) yazılır
- [ ] Claude API bağlantısı kurulur, prompt test edilir
- [ ] Frontend gerçek API yanıtlarını işleyecek şekilde güncellenir

### Aşama 3 — Hata Yönetimi ve Cilalama *(1 gün)*
- [ ] Boş girdi, API hatası ve "bilinmeyen malzeme" durumları yönetilir
- [ ] Yükleniyor animasyonu eklenir
- [ ] Mobil görünüm test edilip düzeltilir

### Aşama 4 — Yayına Alma *(yarım gün)*
- [ ] Vercel veya Netlify'a deploy edilir
- [ ] `.env` değişkenleri platform panelinden ayarlanır
- [ ] Canlı link test edilir, README yazılır

---

## 9. Başarı Kriterleri

Uygulama aşağıdaki koşulları sağladığında **tamamlanmış** sayılır:

1. Kullanıcı herhangi bir malzeme adı yazıp "Analiz Et"e bastığında 5 saniye içinde renk kodlu kart ekranda görünür.
2. Üç kategori (yeşil / sarı / kırmızı) doğru renk ve etiketle gösterilir.
3. Her sonuçta 2–3 eylem adımı listelenir.
4. Sayfa mobil cihazda (375px genişlik) bozulmadan görüntülenir.
5. API anahtarı tarayıcı kaynak kodunda hiçbir şekilde görünmez.
6. Hatalı veya boş girişlerde uygulama çökmez; kullanıcıya anlaşılır mesaj gösterir.

---

## 10. Sonraki Adımlar (Gelecek Versiyonlar)

Bu PRD'nin kapsamı dışında kalan ancak ileride eklenebilecek özellikler:

- 📷 Fotoğraf çekerek malzeme tanıma (vision API)
- 📍 Konuma göre en yakın geri dönüşüm / kompost noktası gösterme
- 🕓 Sorgu geçmişi (local storage)
- 🌍 Çok dil desteği (İngilizce / Almanca)
- 📊 En çok sorgulanan malzemeler istatistiği

---

*Bu belge, uygulamanın v1.0 sürümünü kapsar. Kapsam değişikliklerinde güncellenmesi gerekir.*

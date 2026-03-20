## Akıllı Atık Rehberi – Geliştirme Görevleri

Bu liste, `prd.md` belgesindeki gereksinimlere göre adım adım geliştirme akışını gösterir.

---

### 0. Proje Kurulumu
- [ ] **Klasör yapısını oluştur**  
  - [ ] `akilli-atik-rehberi` ana klasörünü oluştur (veya mevcut projede benzer yapı kur)  
  - [ ] `public/`, `src/`, `api/` klasörlerini oluştur  
  - [ ] Boş `.env`, `.gitignore`, `vercel.json`, `README.md` dosyalarını oluştur
- [ ] **.env ve güvenlik ayarları**  
  - [ ] `.env` içinde `ANTHROPIC_API_KEY` değişkenini tanımla  
  - [ ] `.gitignore` içine `.env` satırını ekle  
  - [ ] API anahtarının hiçbir frontend dosyasında yer almadığını kontrol et

---

### 1. Aşama — Statik Prototip (UI)

- [ ] **HTML iskeletini oluştur (`public/index.html`)**  
  - [ ] Sayfa başlığını ve meta etiketleri ekle  
  - [ ] Üst kısma logo/başlık: `Akıllı Atık Rehberi`  
  - [ ] Alt başlık/slogan: `Atığını yaz. Doğru kutuyu öğren.`  
  - [ ] Metin giriş alanı (placeholder: `"Örn: Biyobozunur PLA çatal"`)  
  - [ ] `Analiz Et` butonu  
  - [ ] Sonuç kartının yerleşeceği konteyner (başta boş)
- [ ] **Stil altyapısını kur (`Tailwind + style.css`)**  
  - [ ] Tailwind CSS’i CDN ile `index.html`e ekle  
  - [ ] `src/style.css` içinde özel stilleri tanımla (kart tasarımı, renk bantları, responsive düzen)  
  - [ ] Arka planı beyaz/açık yeşil tonlu, minimal tasarla  
  - [ ] Mobil (375px) ve geniş ekran (1440px) için temel responsive düzeni kur
- [ ] **Mock veriyle sonuç kartı prototipi**  
  - [ ] `src/main.js` içinde sahte (hard-coded) JSON yanıtı tanımla  
  - [ ] Arama yaptıktan sonra bu mock veriyi kullanarak sonuç kartını göster  
  - [ ] Renk kodu sistemi (yeşil/sarı/kırmızı ve gerekirse gri) için sınıfları ve görünümleri ayarla  
  - [ ] `GERİ DÖNÜŞÜR`, `ENDÜSTRİYEL KOMPOST`, `ÇÖPE ATILIR`, `BİLİNMİYOR` etiketlerini ve ikonları göster  
  - [ ] `Yeni Sorgula` butonunu ekle ve formu sıfırlama davranışını tanımla
- [ ] **Aşama 1 doğrulama**  
  - [ ] Farklı mock kategorilerle kartın tasarımını test et  
  - [ ] Renk, label ve ikonların doğru eşleştiğini kontrol et  

---

### 2. Aşama — AI Entegrasyonu

- [ ] **Backend endpoint tasarımı (`/api/analyze`)**  
  - [ ] `api/analyze.js` dosyasını oluştur  
  - [ ] POST isteğinde `query` alanını okuyan basit bir Express/Edge handler yaz  
  - [ ] Boş veya çok uzun sorguları (ör. > 200 karakter) 400 hatasıyla geri döndür
- [ ] **Claude API entegrasyonu**  
  - [ ] `ANTHROPIC_API_KEY`’i `.env` üzerinden okuyacak yapı kur  
  - [ ] `https://api.anthropic.com/v1/messages` endpointine POST isteği atan fonksiyonu yaz  
  - [ ] PRD’de verilen sistem prompt’unu olduğu gibi (veya çok küçük uyarlamalarla) kullan  
  - [ ] Yanıttan `category`, `color`, `label`, `explanation`, `steps` alanlarını ayrıştır  
  - [ ] Backend’in frontend’e sadeleştirilmiş JSON döndürmesini sağla (sadece gerekli alanlar)
- [ ] **Frontend–Backend entegrasyonu**  
  - [ ] `src/main.js` içinde `Analiz Et` butonuna tıklandığında `/api/analyze` endpointine `fetch` isteği gönder  
  - [ ] Yükleniyor durumunda butonu devre dışı bırak ve “Yükleniyor…” göstergesi ekle  
  - [ ] API yanıtına göre renkli sonuç kartını dinamik olarak oluştur  
  - [ ] `Yeni Sorgula` tıklandığında kartı temizle ve forma odaklan
- [ ] **Aşama 2 doğrulama**  
  - [ ] Gerçek bir örnek sorgu ile Claude’dan JSON geldiğini doğrula  
  - [ ] Her üç ana kategori (recyclable / industrial_compost / trash) için test sorguları dene  

---

### 3. Aşama — Hata Yönetimi ve Cilalama

- [ ] **Hata durumları (frontend + backend)**  
  - [ ] Boş sorgu için kullanıcıya: `"Lütfen bir malzeme adı girin."` mesajını göster  
  - [ ] Claude veya backend hatasında: `"Şu an analiz yapılamıyor, lütfen tekrar deneyin."` mesajını göster  
  - [ ] `unknown` kategori için gri kart ve `"Bu malzeme hakkında yeterli veri bulunamadı."` mesajını göster  
  - [ ] Hata durumlarında uygulamanın çökmediğini ve arayüzün tutarlı kaldığını test et
- [ ] **Yükleniyor animasyonu ve UX iyileştirmeleri**  
  - [ ] Sorgu sırasında basit bir loading spinner veya animasyon göster  
  - [ ] Çok uzun açıklama/metin durumlarında kartın taşmamasını sağla  
  - [ ] Klavyeden Enter ile sorgu başlatılmasını destekle
- [ ] **Mobil ve performans kontrolleri**  
  - [ ] 375px mobil görünümde tüm öğelerin okunaklı olduğundan emin ol  
  - [ ] Lighthouse ile temel bir performans testi çalıştır (hedef ≥ 85)  
  - [ ] İlk yüklenme süresini hafifletmek için gereksiz script ve stil yüklerini azalt

---

### 4. Aşama — Yayına Alma

- [ ] **Deploy ayarları**  
  - [ ] `vercel.json` içinde `/api/analyze` için route’ları ayarla (veya Netlify eşdeğeri)  
  - [ ] Projeyi Vercel veya Netlify üzerine deploy et  
  - [ ] Platform panelinde `ANTHROPIC_API_KEY` ortam değişkenini tanımla
- [ ] **Canlı ortam testleri**  
  - [ ] Canlı sitede örnek 3–5 sorgu çalıştır  
  - [ ] Mobil cihaz (veya emülatör) üzerinden testi tekrarla  
  - [ ] Tarayıcı kaynak kodunda API anahtarının görünmediğini doğrula
- [ ] **README güncelleme**  
  - [ ] Kurulum adımlarını (bağımlılıklar, environment değişkenleri, çalıştırma komutları) yaz  
  - [ ] Deploy ve ortam değişkeni talimatlarını ekle  
  - [ ] Kısa bir ürün tanımı ve başarı kriterlerini özetle

---

### 5. Ek (Opsiyonel) İyileştirmeler

- [ ] Basit rate limiting (IP başına dakikada 10 istek gibi) ekle  
- [ ] Sonuç metinlerinde küçük dil/ifade düzeltmeleri yap  
- [ ] Geri bildirim toplamak için basit bir link veya buton ekle (ör. GitHub Issues)


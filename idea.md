# idea.md — Akıllı Atık Rehberi

---

## 🧩 Problem

Tüketici pazarında "biyobozunur", "kompostlanabilir" veya "doğa dostu" olarak etiketlenen ambalajlar hızla çoğalmaktadır. Ancak bu etiketlerin büyük çoğunluğu **yanıltıcıdır (greenwashing)**:

- **PLA (polylactic acid)** tabanlı biyoplastikler yalnızca **endüstriyel kompost tesislerinde** (~60°C, kontrollü nem) bozunabilmekte; ev kompostunda veya doğada onlarca yıl kalmaktadır.
- **Deniz yosunu** veya **avokado çekirdeği kompozit** ambalajlar, biyolojik içerik taşısa da katkı maddeleri nedeniyle standart plastik geri dönüşüm zinciriyle uyumsuz olabilmektedir.
- Tüketici, ambalajı yanlış kutuya attığında hem geri dönüşüm partisini kirletmekte hem de çevre yükünü artırmaktadır.

**Sonuç:** İyi niyetli tüketici, hangi atığı hangi kutuya atacağını bilememekte; "doğru" davranmak giderek daha karmaşık bir bilgi problemine dönüşmektedir.

---

## 👤 Kullanıcı

| Özellik | Tanım |
|---|---|
| **Birincil hedef kitle** | Çevreye duyarlı, bilinçli tüketim alışkanlığı edinmeye çalışan bireyler (25–45 yaş) |
| **Teknik bilgi düzeyi** | Orta–düşük; kimya veya malzeme bilgisi beklenmez |
| **Motivasyon** | Atığını doğru ayırmak, greenwashing'e aldanmamak, somut çevresel katkı sağlamak |
| **Kullanım bağlamı** | Mutfakta, marketten dönerken veya çöp atarken — anlık, hızlı karar anı |
| **Acı noktası** | Ambalaj üzerindeki çelişkili semboller ve belirsiz etiketler karşısında yaşanan kararsızlık |

---

## 🤖 AI'ın Rolü

Yapay zeka uygulamada **malzeme analiz motoru** olarak görev yapar:

1. **Girdi:** Kullanıcı, elindeki ambalajı serbest metinle tanımlar (örn. *"deniz yosunundan yapılmış bardak"*, *"PLA logolu kahve kapağı"*, *"avokado bazlı köpük kutu"*).
2. **Analiz:** AI, malzemenin kimyasal/biyolojik yapısını ve mevcut sertifikasyon standartlarını (EN 13432, ASTM D6400 vb.) değerlendirerek şu soruları yanıtlar:
   - Bu malzeme **evde** bozunabilir mi?
   - **Endüstriyel kompost tesisi** gerektirir mi?
   - **Doğada** bozunur mu, yoksa mikro plastik bırakır mı?
   - Standart **plastik geri dönüşüm** akışına girmeli mi?
   - **Çöp** olarak mı bertaraf edilmelidir?
3. **Çıktı:** Renk kodlu, net ve gerekçeli bir atık yönlendirme talimatı sunar.

| Renk | Anlam |
|---|---|
| 🟢 Yeşil | Ev kompostu — güvenle kompostlayabilirsiniz |
| 🟡 Sarı | Endüstriyel kompost — belediye kompost noktasına götürün |
| 🔵 Mavi | Plastik geri dönüşüm kutusu |
| 🔴 Kırmızı | Normal çöp — geri dönüştürülemez, kompostlanamaz |
| ⚠️ Gri | Belirsiz / daha fazla bilgi gerekli |

AI ayrıca kullanıcıya etiketin neden yanıltıcı olduğunu kısa ve anlaşılır dilde açıklar; böylece zamanla malzeme okuryazarlığı gelişir.

---

## ⚔️ Rakip Durum

| Rakip / Alternatif | Eksiklik |
|---|---|
| Belediye atık rehberleri (web/broşür) | Genel kategoriler; yeni nesil biyoplastikleri kapsamaz |
| RecycleNation, iRecycle (ABD odaklı) | Konum bazlı tesis arama; malzeme kimyası analizi yok |
| Too Good To Go / Loop gibi platformlar | Ambalaj azaltma odaklı; atık yönlendirme işlevi yok |
| ChatGPT / genel AI | Spesifik, renk kodlu, standart referanslı rehberlik sunmaz; tutarsız yanıtlar verebilir |
| Ambalaj üstü QR kodları | Marka kontrolünde; tarafsız değil, greenwashing'in parçası olabilir |

**Boşluk:** Kimyasal gerçeklik + kullanıcı dostu UX + tarafsız AI analizi kombinasyonunu sunan, Türkçe ve/veya Avrupa pazarına yönelik bir araç henüz mevcut değil.

---

## ✅ Başarı Kriteri

### Kullanıcı Deneyimi
- [ ] Kullanıcı, ambalajı tanımladıktan sonra **10 saniye içinde** net bir yönlendirme alır.
- [ ] Yanıt, teknik jargon içermez; 8. sınıf okuma seviyesinde anlaşılırdır.
- [ ] Kullanıcı, AI'ın gerekçesini okuyarak "neden bu kutu?" sorusunu cevaplayabilir.

### Doğruluk & Güvenilirlik
- [ ] AI yanıtları, EN 13432 / ASTM D6400 / ISO 17088 gibi uluslararası standartlarla **çelişmez**.
- [ ] Bilinmeyen veya belirsiz malzemelerde AI, yanlış kesinlik yerine **"belirsiz"** kategorisini seçer.
- [ ] Beta sürecinde uzman incelemesinden geçen test seti üzerinde **%85+ doğruluk** hedeflenir.

### Etki & Büyüme
- [ ] İlk 3 ayda **500 tekil sorgu** gerçekleştirilir.
- [ ] Kullanıcı geri bildirimlerinde **%70+** "bu bilgiyi daha önce bilmiyordum" yanıtı alınır.
- [ ] En az **3 farklı yeni nesil ambalaj kategorisi** (PLA, deniz yosunu, avokado kompozit) doğru sınıflandırılır.

# Akıllı Atık Rehberi

Tek sayfalık (SPA) bir web uygulaması. Kullanıcı, elindeki ambalajı/metni yazar ve yapay zekâdan renk kodlu geri dönüşüm talimatı alır.

## Kurulum

```bash
cd akilli-atik-rehberi
```

`.env` dosyasına Anthropic API anahtarınızı ekleyin:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

Geliştirme sırasında basitçe bir statik sunucu veya canlı sunucu eklentisi (VS Code Live Server vb.) ile `public/index.html` dosyasını açabilirsiniz.

Backend endpoint’i (`/api/analyze`) Vercel gibi bir ortama deploy edildiğinde çalışacak şekilde tasarlanacaktır.


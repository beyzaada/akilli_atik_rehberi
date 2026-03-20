export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Sadece POST istekleri kabul edilir.' });
    }
  
    const rawQuery = req.body.query;
    
    // ŞİFRE BURADA GİZLİ: Vercel'in güvenli kasasından şifreyi otomatik çekeceğiz!
    const API_KEY = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;
  
    const systemPrompt = `Aşağıdaki malzemenin nasıl geri dönüştürüleceğini veya atılacağını analiz et. 
    SADECE şu formattaki bir JSON objesi ile cevap ver, başka hiçbir açıklama yazma:
    {
      "category": "recyclable" veya "industrial_compost" veya "trash" veya "unknown",
      "color": "green" veya "yellow" veya "red" veya "gray",
      "label": "GERİ DÖNÜŞÜR" veya "ENDÜSTRİYEL KOMPOST" veya "ÇÖPE ATILIR" veya "BİLİNMİYOR",
      "explanation": "Bu malzemenin neden bu kategoriye girdiğine dair kısa bir açıklama.",
      "steps": ["Adım 1", "Adım 2", "Adım 3"]
    }
    Malzeme: ${rawQuery}`;
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }]
        })
      });
  
      const data = await response.json();
      const candidate0 = data.candidates[0];
      const text = candidate0?.content?.parts?.[0]?.text ?? candidate0?.output_text ?? "";
  
      res.status(200).json({ text: text });
    } catch (error) {
      res.status(500).json({ error: 'Gemini API ile iletişim kurulamadı.' });
    }
  }
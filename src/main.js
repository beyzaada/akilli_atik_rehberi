const form = document.getElementById("query-form");
const queryInput = document.getElementById("query");
const analyzeButton = document.getElementById("analyze-button");
const resultContainer = document.getElementById("result-container");
const messageArea = document.getElementById("message-area");
const loadingState = document.getElementById("loading-state");

// Buraya kendi Gemini API anahtarını yapıştıracaksın.

const MOCK_RESPONSES = {
  recyclable: {
    category: "recyclable",
    color: "green",
    label: "GERİ DÖNÜŞÜR",
    explanation: "Bu ambalaj standart plastik/kağıt geri dönüşümüne uygundur.",
    steps: [
      "Ambalajı boşalt ve temizleyebiliyorsan hafifçe durula.",
      "Yerel geri dönüşüm kutusundaki uygun bölmeye at.",
      "Farklı malzemeleri mümkünse birbirinden ayır."
    ],
    icon: "♻️"
  },
  industrial_compost: {
    category: "industrial_compost",
    color: "yellow",
    label: "ENDÜSTRİYEL KOMPOST",
    explanation:
      "Bu biyoplastik yalnızca endüstriyel kompost tesislerinde güvenle bozunabilir, ev kompostu için uygun değildir.",
    steps: [
      "Belediyenin kompost toplama sistemine veya yetkili tesise ulaştır.",
      "Ev kompostuna veya doğaya bırakma.",
      "Plastik geri dönüşüm kutusuna karıştırma."
    ],
    icon: "🌿"
  },
  trash: {
    category: "trash",
    color: "red",
    label: "ÇÖPE ATILIR",
    explanation:
      "Bu malzeme mevcut geri dönüşüm ve kompost sistemleriyle uyumlu değildir.",
    steps: [
      "Evsel atık kutusuna at.",
      "Doğaya veya kanalizasyona bırakma.",
      "Mümkünse bir sonraki alışverişinde daha sürdürülebilir alternatifini tercih et."
    ],
    icon: "🗑️"
  },
  unknown: {
    category: "unknown",
    color: "gray",
    label: "BİLİNMİYOR",
    explanation:
      "Bu malzeme hakkında yeterli bilgi yok veya mevcut standartlarla net bir sınıflandırma yapılamıyor.",
    steps: [
      "Varsayılan olarak evsel atık kutusuna yönlendir.",
      "Yerel belediyenin atık rehberini kontrol et.",
      "Markadan daha şeffaf malzeme bilgisi talep et."
    ],
    icon: "❔"
  }
};

function setMessage(text, type = "info") {
  if (!text) {
    messageArea.innerHTML = "";
    return;
  }
  const base =
    "px-3 py-2 rounded-lg text-sm mt-1 border transition-colors duration-150";
  const variants = {
    info: "bg-emerald-50 border-emerald-100 text-emerald-800",
    error: "bg-red-50 border-red-100 text-red-800"
  };
  messageArea.innerHTML = `<div class="${base} ${variants[type] || variants.info}">${text}</div>`;
}

function renderResultCard(data) {
  if (!data) {
    resultContainer.innerHTML = "";
    return;
  }

  const colorClassMap = {
    green: { band: "band-green", pill: "pill-green" },
    yellow: { band: "band-yellow", pill: "pill-yellow" },
    red: { band: "band-red", pill: "pill-red" },
    gray: { band: "band-gray", pill: "pill-gray" }
  };

  const colors = colorClassMap[data.color] || colorClassMap.gray;

  const stepsHtml = (data.steps || [])
    .map((step) => `<li>${step}</li>`)
    .join("");

  resultContainer.innerHTML = `
    <article class="result-card border-emerald-100 bg-white/95">
      <div class="result-band ${colors.band}"></div>
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="result-icon">${data.icon || "♻️"}</span>
            <h2 class="result-title">${data.label}</h2>
          </div>
          <p class="result-explanation text-slate-700">
            ${data.explanation}
          </p>
        </div>
        <span class="pill-label ${colors.pill}">
          KATEGORİ
        </span>
      </div>
      <ul class="result-steps text-slate-700 list-disc">
        ${stepsHtml}
      </ul>
      <div class="mt-4 flex justify-end">
        <button
          id="reset-button"
          type="button"
          class="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          Yeni Sorgula
        </button>
      </div>
    </article>
  `;

  const resetButton = document.getElementById("reset-button");
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      resultContainer.innerHTML = "";
      setMessage("");
      queryInput.value = "";
      queryInput.focus();
    });
  }
}

function pickMockResponse(query) {
  const normalized = query.toLowerCase();
  if (normalized.includes("pla")) return MOCK_RESPONSES.industrial_compost;
  if (normalized.includes("kağıt") || normalized.includes("karton"))
    return MOCK_RESPONSES.recyclable;
  if (normalized.includes("saman") || normalized.includes("biyobozunur ev"))
    return MOCK_RESPONSES.recyclable;
  if (normalized.includes("pipet") || normalized.includes("pet") || normalized.includes("poşet"))
    return MOCK_RESPONSES.trash;
  return MOCK_RESPONSES.unknown;
}

function mapGeminiCategoryToUI(payload) {
  if (!payload || !payload.category) {
    return MOCK_RESPONSES.unknown;
  }

  const base = {
    explanation: payload.explanation || "",
    steps: Array.isArray(payload.steps) && payload.steps.length > 0 ? payload.steps : MOCK_RESPONSES.unknown.steps
  };

  switch (payload.category) {
    case "recyclable":
      return {
        ...MOCK_RESPONSES.recyclable,
        ...base
      };
    case "industrial_compost":
      return {
        ...MOCK_RESPONSES.industrial_compost,
        ...base
      };
    case "trash":
      return {
        ...MOCK_RESPONSES.trash,
        ...base
      };
    case "unknown":
    default:
      return {
        ...MOCK_RESPONSES.unknown,
        ...base
      };
  }
}

function stripMarkdownCodeFences(text) {
  if (!text) return "";
  // Örn: ```json ... ``` veya ``` ... ``` sarmallarını temizler.
  return text.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "").trim();
}

function extractFirstJsonObject(text) {
  const stripped = stripMarkdownCodeFences(text);

  const firstBrace = stripped.indexOf("{");
  const lastBrace = stripped.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return stripped.slice(firstBrace, lastBrace + 1).trim();
  }

  // Fallback: ilk görülen { ... } bloğunu yakalamaya çalış.
  const match = stripped.match(/\{[\s\S]*\}/);
  return match ? match[0] : stripped;
}

function parseGeminiJson(text) {
  const candidate = extractFirstJsonObject(text);
  try {
    return JSON.parse(candidate);
  } catch (e) {
    // Daha anlaşılır hata için kısa bir debug metni ekliyoruz.
    throw new Error(
      "JSON parse hatası: " +
        e.message +
        " | Aday JSON (kısaltılmış): " +
        candidate.slice(0, 120)
    );
  }
}

async function callGemini(rawQuery) {
  // Artık Google'a değil, kendi güvenli aracı dosyamıza (backend) gidiyoruz!
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: rawQuery })
  });

  if (!response.ok) {
    throw new Error("Sunucu ile iletişim kurulamadı: " + response.statusText);
  }

  const data = await response.json();
  
  if (!data.text) {
    throw new Error("Boş yanıt alındı.");
  }

  return { text: data.text };
}

function setLoading(isLoading) {
  if (isLoading) {
    loadingState.classList.remove("hidden");
    analyzeButton.disabled = true;
  } else {
    loadingState.classList.add("hidden");
    analyzeButton.disabled = false;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const rawQuery = (queryInput.value || "").trim();

  if (!rawQuery) {
    setMessage("Lütfen bir malzeme adı girin.", "error");
    renderResultCard(null);
    return;
  }

  if (rawQuery.length > 200) {
    setMessage("Sorgu çok uzun. Lütfen daha kısa ve net bir tanım yazın.", "error");
    renderResultCard(null);
    return;
  }

  setMessage("");
  setLoading(true);
  renderResultCard(null);

  callGemini(rawQuery)
    .then(({ text }) => {
      const parsed = parseGeminiJson(text);
      return mapGeminiCategoryToUI(parsed);
    })
    .then((uiPayload) => {
      renderResultCard(uiPayload);
    })
    .catch((error) => {
      console.error(error);
      setMessage(
        "Şu an analiz yapılamıyor, lütfen tekrar deneyin.",
        "error"
      );
    })
    .finally(() => {
      setLoading(false);
    });
});

queryInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    form.requestSubmit();
  }
});

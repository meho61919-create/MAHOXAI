// core.js - Gerçek Hata Gösterici
async function askMahox(userMessage) {
    try {
       // core.js içinde istek attığın yer
const response = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userInput })
});

        const result = await response.json();

        if (!response.ok) {
            // "Öksürdü" yerine gerçek hatayı yazdırıyoruz
            return "MAHOX Hatası: " + (result.error || "Bilinmeyen bir sorun var.");
        }

        if (Array.isArray(result) && result[0].generated_text) {
            return result[0].generated_text.split("<|assistant|>").pop().trim();
        }
        return "Ağa veri geldi ama formatı bozuk!";
    } catch (error) {
        return "Bağlantı hatası: Backend'e ulaşılamıyor!";
    }
}



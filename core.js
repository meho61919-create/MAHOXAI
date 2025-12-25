// core.js - Gerçek Hata Gösterici
async function askMahox(userMessage) {
    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage }),
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

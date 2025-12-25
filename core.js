// core.js - MAHOXAI ULTRA MOTORU
const MAHOX_CONFIG = {
    // BURAYA KENDİ TOKEN'INI YAPIŞTIR
    API_KEY: "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", 
    CHAT_MODEL: "HuggingFaceH4/zephyr-7b-beta", // Daha hızlı ve açık model
    IMAGE_MODEL: "https://image.pollinations.ai/prompt/"
};

// core.js - Hata Tespit Güncellemesi
async function askMahox(userMessage) {
    try {
        const response = await fetch(
            `https://api-inference.huggingface.co/models/${MAHOX_CONFIG.CHAT_MODEL}`,
            {
                headers: { 
                    "Authorization": `Bearer ${MAHOX_CONFIG.API_KEY}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({ 
                    inputs: `<|system|>\nSen MAHOXAI isminde bir mahalle abisisin.</s>\n<|user|>\n${userMessage}</s>\n<|assistant|>`,
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.log("Hata Detayı:", errorText); // F12 Konsolunda buraya bak!
            return "Ağa API anahtarında sorun var gibi, F12 konsoluna bir bak bakayım ne yazıyor.";
        }

        const data = await response.json();
        return data[0].generated_text.split("<|assistant|>").pop().trim();
    } catch (error) {
        console.error("Bağlantı Hatası:", error);
        return "Ağa internetin gitmiş veya tarayıcı API'yi engelliyor!";
    }
}
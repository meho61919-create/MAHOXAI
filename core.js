// core.js - MAHOXAI ULTRA STABLE ENGINE
const MAHOX_CONFIG = {
    // Kendi token'ını tırnak içine yapıştır
    API_KEY: "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", 
    CHAT_MODEL: "HuggingFaceH4/zephyr-7b-beta",
};

async function askMahox(userMessage) {
    const apiEndpoint = `https://api-inference.huggingface.co/models/${MAHOX_CONFIG.CHAT_MODEL}`;
    
    try {
        const response = await fetch(apiEndpoint, {
            method: "POST",
            mode: 'cors', // Tarayıcıya CORS protokolünü kullanacağını açıkça söyler
            headers: { 
                "Authorization": `Bearer ${MAHOX_CONFIG.API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                inputs: `<|system|>\nSen MAHOXAI isminde, zeki ve samimi bir mahalle abisisin. Kullanıcıya 'ağa' diye hitap et.</s>\n<|user|>\n${userMessage}</s>\n<|assistant|>`,
                parameters: {
                    max_new_tokens: 500,
                    return_full_text: false, // Sadece cevabı almak için kritik
                    temperature: 0.7
                }
            }),
        });

        // Sunucudan yanıt gelirse ama hata varsa (Token yanlışı vs.)
        if (!response.ok) {
            const errorInfo = await response.json();
            console.error("HuggingFace Hatası:", errorInfo);
            
            if (errorInfo.error && errorInfo.error.includes("currently loading")) {
                return "Ağa motor ısınıyor (Model yükleniyor), bir 20 saniye sonra tekrar yüklen!";
            }
            return `Ağa bir aksilik oldu: ${errorInfo.error || "Bilinmeyen hata"}`;
        }

        const data = await response.json();
        
        // Gelen veriyi temizle ve sadece cevabı döndür
        let finalReply = "";
        if (Array.isArray(data) && data[0].generated_text) {
            finalReply = data[0].generated_text.split("<|assistant|>").pop().trim();
        } else if (data.generated_text) {
            finalReply = data.generated_text.split("<|assistant|>").pop().trim();
        } else {
            finalReply = "Ağa cevap boş geldi, tekrar bir dürtsene beni.";
        }

        return finalReply;

    } catch (error) {
        // Eğer hala CORS veya internet hatası varsa burası çalışır
        console.error("Kritik Bağlantı Hatası:", error);
        
        // SON ÇARE: Eğer Vercel'de hala CORS alıyorsan, bu Proxy'li adresi dene:
        // return await askWithProxy(userMessage); 
        
        return "Ağa internetin veya tarayıcı izinlerin bana engel oluyor. F12 konsoluna bir bak bakalım.";
    }
}

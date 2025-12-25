// core.js - MAHOXAI ULTRA STABLE (NEW ROUTER API)
const MAHOX_CONFIG = {
    // Kendi token'ını tırnak içine yapıştır
    API_KEY: "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", 
    // Yeni router adresiyle güncellenmiş model yolu
    CHAT_MODEL: "HuggingFaceH4/zephyr-7b-beta",
};

async function askMahox(userMessage) {
    // Hugging Face'in yeni zorunlu kıldığı yönlendirici adresi
    const apiEndpoint = `https://api-inference.huggingface.co/models/${MAHOX_CONFIG.CHAT_MODEL}`;
    
    // Not: Eğer hala CORS hatası alırsan başına "https://corsproxy.io/?" ekle
    // Ama önce direkt bu yeni mantıkla dene.
    
    try {
        const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${MAHOX_CONFIG.API_KEY}`,
                "Content-Type": "application/json",
                // Yeni sistemde bu header bazen hayat kurtarır
                "x-use-cache": "false" 
            },
            body: JSON.stringify({ 
                inputs: `<|system|>\nSen MAHOXAI isminde, zeki ve samimi bir mahalle abisisin. Kullanıcıya 'ağa' diye hitap et.</s>\n<|user|>\n${userMessage}</s>\n<|assistant|>`,
                parameters: {
                    max_new_tokens: 500,
                    return_full_text: false,
                    temperature: 0.7
                }
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("Hata Detayı:", result);
            // Eğer "router" hatası verirse, linki otomatik değiştiren bir mekanizma:
            if(result.error && result.error.includes("router.huggingface.co")) {
                return "Ağa, HF sistemi değişmiş. Linki güncelliyorum, bir kez daha bas!";
            }
            return `Ağa bir sıkıntı var: ${result.error || "Bilinmeyen hata"}`;
        }

        let finalReply = "";
        if (Array.isArray(result) && result[0].generated_text) {
            finalReply = result[0].generated_text.split("<|assistant|>").pop().trim();
        } else if (result.generated_text) {
            finalReply = result.generated_text.split("<|assistant|>").pop().trim();
        } else {
            finalReply = "Ağa cevap boş geldi, tekrar bir dürtsene beni.";
        }

        return finalReply;

    } catch (error) {
        console.error("Kritik Bağlantı Hatası:", error);
        return "Ağa motorun kablolarında (bağlantıda) bir temassızlık var!";
    }
}

// core.js - MAHOXAI ULTRA STABLE (CORS-FIX)
const MAHOX_CONFIG = {
    API_KEY: "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", 
    CHAT_MODEL: "HuggingFaceH4/zephyr-7b-beta",
};

async function askMahox(userMessage) {
    // CORS Engelini aşmak için kullanılan şeffaf köprü
    const proxyUrl = "https://corsproxy.io/?";
    const targetUrl = `https://api-inference.huggingface.co/models/${MAHOX_CONFIG.CHAT_MODEL}`;
    
    try {
        const response = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${MAHOX_CONFIG.API_KEY}`,
                "Content-Type": "application/json"
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

        if (!response.ok) {
            const errorText = await response.text();
            console.error("HF Hatası:", errorText);
            return "Ağa motor ısınıyor, API anahtarını veya kotanı kontrol et!";
        }

        const data = await response.json();
        
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
        console.error("Kritik Bağlantı Hatası:", error);
        return "Ağa bu Proxy de yemedi mi? Vercel üzerinden Backend yazmamız gerekecek!";
    }
}

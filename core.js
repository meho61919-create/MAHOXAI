// MAHOXAI - GitHub Pages Güvenli Versiyon
async function askMahox(userInput) {
    // Token'ı kodun içine yazmıyoruz, tarayıcı hafızasından çekiyoruz
    const API_TOKEN = localStorage.getItem("MAHOX_TOKEN"); 
    const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

    if (!API_TOKEN) {
        return "Ağa token girmedin! Console'a 'setToken(\"hf_...\")' yaz veya giriş yap.";
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_TOKEN}`
            },
            body: JSON.stringify({ 
                inputs: `User: ${userInput}\nAssistant:`,
                parameters: { max_new_tokens: 250, wait_for_model: true }
            })
        });

        const result = await response.json();
        if (Array.isArray(result) && result[0].generated_text) {
            return result[0].generated_text.split("Assistant:").pop().trim();
        }
        return "Cevap alınamadı.";
    } catch (error) {
        return "Bağlantı hatası! Token yanlış olabilir veya model uykuda.";
    }
}

// Token'ı hafızaya kaydetmek için yardımcı fonksiyon
function setToken(token) {
    localStorage.setItem("MAHOX_TOKEN", token);
    console.log("Token başarıyla zırhlandı!");
}

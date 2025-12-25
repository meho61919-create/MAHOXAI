export default async function handler(req, res) {
    // CORS ayarları (Zırhlı)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Token ve Mesaj Kontrolü
    const TOKEN = "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"; // Senin yeni ve izinli tokenın
    const body = req.body || {};
    const userMessage = body.message || "Merhaba";

    try {
        // En garanti Hugging Face adresi
        const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
            headers: { 
                "Authorization": `Bearer ${TOKEN}`,
                "Content-Type": "application/json" 
            },
            method: "POST",
            body: JSON.stringify({ 
                inputs: `<|system|>\nSen MAHOXAI isminde zeki bir mahalle abisisin.</s>\n<|user|>\n${userMessage}</s>\n<|assistant|>`,
                parameters: { max_new_tokens: 200, temperature: 0.7 }
            }),
        });

        const textData = await response.text(); // Önce metin olarak alalım ki patlamasın

        try {
            const jsonData = JSON.parse(textData);
            if (!response.ok) {
                return res.status(response.status).json({ error: jsonData.error || "HF Kapalı ağa!" });
            }
            return res.status(200).json(jsonData);
        } catch (e) {
            // Eğer gelen veri JSON değilse (yani o meşhur 'N' hatası burası)
            return res.status(500).json({ error: "HuggingFace saçmaladı: " + textData.substring(0, 50) });
        }

    } catch (error) {
        return res.status(500).json({ error: "Sistem hatası: " + error.message });
    }
}

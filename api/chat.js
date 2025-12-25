export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { message } = req.body || {};
    const TOKEN = "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"; // Senin Token

    try {
        // REÇETE: Router adresini daha standart bir hale getirdik ve modeli Mistral yaptık
        const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3", {
            headers: { 
                "Authorization": `Bearer ${TOKEN}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ 
                inputs: `<s>[INST] Sen MAHOXAI isminde zeki bir mahalle abisisin. Cevaplarını buna göre ver. [/INST] Tamam kardeş.</s> [INST] ${message} [/INST]`,
                parameters: { max_new_tokens: 300, temperature: 0.7 }
            }),
        });

        const textData = await response.text();

        try {
            const jsonData = JSON.parse(textData);
            if (!response.ok) {
                return res.status(response.status).json({ error: jsonData.error || "HuggingFace hata verdi!" });
            }
            return res.status(200).json(jsonData);
        } catch (e) {
            // Eğer hala "Not Found" gelirse, token izinlerini veya model adını tekrar kontrol edeceğiz
            return res.status(500).json({ error: "HF Cevabı: " + textData });
        }

    } catch (error) {
        return res.status(500).json({ error: "Bağlantı Hatası: " + error.message });
    }
}

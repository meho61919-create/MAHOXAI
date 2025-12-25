export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { message } = req.body || {};
    const TOKEN = "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"; // Senin Token

    try {
        // İŞTE O ŞART KOŞTUKLARI ROUTER ADRESİ
        const response = await fetch("https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.3", {
            headers: { 
                "Authorization": `Bearer ${TOKEN}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ 
                inputs: `<s>[INST] Sen MAHOXAI isminde zeki bir mahalle abisisin. Cevaplarını buna göre ver. [/INST] Tamam kardeş.</s> [INST] ${message} [/INST]`,
                parameters: { 
                    max_new_tokens: 300, 
                    temperature: 0.7,
                    return_full_text: false
                }
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ 
                error: data.error || "Router kapıyı açmadı ağa!" 
            });
        }

        // Başarılı cevap
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: "Sistem hatası: " + error.message });
    }
}

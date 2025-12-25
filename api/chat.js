export default async function handler(req, res) {
    // CORS Başlıkları
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { message } = req.body || {};
    // TOKEN: O izinlerini (Inference Providers) yeni verdiğin Classic Token'ı yapıştır
    const TOKEN = "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"; 

    try {
        // İŞTE YENİ VE DESTEKLENEN ADRES:
        const response = await fetch("https://router.huggingface.co/hf-inference/models/HuggingFaceH4/zephyr-7b-beta", {
            headers: { 
                "Authorization": `Bearer ${TOKEN}`,
                "Content-Type": "application/json" 
            },
            method: "POST",
            body: JSON.stringify({ 
                inputs: `<|system|>\nSen MAHOXAI isminde zeki bir mahalle abisisin.</s>\n<|user|>\n${message}</s>\n<|assistant|>`,
                parameters: { 
                    max_new_tokens: 500,
                    temperature: 0.7,
                    return_full_text: false 
                }
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ 
                error: data.error || "HuggingFace router reddetti ağa!" 
            });
        }

        // Zephyr modeli bazen [{generated_text: "..."}] şeklinde döner
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: "Router bağlantısı koptu: " + error.message });
    }
}

// api/chat.js - MAHOXAI NEW ROUTER UPDATE
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST lazım ağa!' });

    // Buraya kendi token'ını yapıştır
    const TOKEN = "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"; 

    const { message } = req.body;

    try {
        // ESKİ: api-inference.huggingface.co -> YENİ: router.huggingface.co
        const response = await fetch("https://router.huggingface.co/hf-inference/models/HuggingFaceH4/zephyr-7b-beta", {
            headers: { 
                "Authorization": `Bearer ${TOKEN}`,
                "Content-Type": "application/json" 
            },
            method: "POST",
            body: JSON.stringify({ 
                inputs: `<|system|>\nSen MAHOXAI isminde, zeki bir mahalle abisisin.</s>\n<|user|>\n${message}</s>\n<|assistant|>`,
                parameters: { max_new_tokens: 500, temperature: 0.7 }
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data.error || "HuggingFace cevap vermedi ağa!" });
        }

        const finalData = Array.isArray(data) ? data : [data];
        res.status(200).json(finalData);

    } catch (error) {
        res.status(500).json({ error: "Bağlantı koptu: " + error.message });
    }
}

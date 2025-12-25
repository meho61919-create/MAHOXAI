// api/chat.js - Arıza Tespit Modu
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { message } = req.body;
    const API_KEY = process.env.MAHOX_KEY; 

    // KRİTİK KONTROL: Token Vercel'e yüklendi mi?
    if (!API_KEY) {
        return res.status(500).json({ error: "Vercel'de MAHOX_KEY tanımlanmamış ağa!" });
    }

    try {
        const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
            headers: { 
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json" 
            },
            method: "POST",
            body: JSON.stringify({ 
                inputs: `<|system|>\nSen MAHOXAI isminde bir mahalle abisisin.</s>\n<|user|>\n${message}</s>\n<|assistant|>`,
                parameters: { max_new_tokens: 500 }
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Hatayı direkt ekrana basalım ki sorunu görelim
            return res.status(response.status).json({ error: data.error || "HF Hatası" });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Bağlantı koptu: " + error.message });
    }
}

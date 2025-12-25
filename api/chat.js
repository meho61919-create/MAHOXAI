// api/chat.js
export default async function handler(req, res) {
    // CORS ayarlarını sunucu tarafında da ekleyelim (Güvenlik önlemi)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Sadece POST isteği ağa!' });
    }

    const { message } = req.body;
    // TOKEN'I BURAYA YAPIŞTIR (Vercel değişkeniyle uğraşma şimdilik)
    const TOKEN = "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"; 

    try {
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
            return res.status(response.status).json({ error: data.error || "HF Hatası" });
        }

        res.status(200).json(data);

    } catch (error) {
        console.error("Backend hatası:", error);
        res.status(500).json({ error: "Backend patladı ağa: " + error.message });
    }
}

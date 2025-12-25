// api/chat.js - MAHOXAI Gizli Köprüsü
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { message } = req.body;
    const API_KEY = process.env.MAHOX_KEY; // Token'ı Vercel panelinden vereceğiz

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
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Sunucu hatası ağa!" });
    }
}
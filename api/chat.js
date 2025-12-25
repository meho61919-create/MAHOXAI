// api/chat.js - MAHOXAI KESİN ÇÖZÜM
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Sadece POST isteği ağa!' });

    // BURAYA KENDİ TOKEN'INI TIRNAK İÇİNDE YAPIŞTIR
    const HARDCODED_KEY = "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"; 

    const { message } = req.body;

    try {
        const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
            headers: { 
                "Authorization": `Bearer ${HARDCODED_KEY}`,
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

        // Eğer cevap bir array ise ilkini al, değilse direkt döndür
        const finalData = Array.isArray(data) ? data : [data];
        res.status(200).json(finalData);

    } catch (error) {
        res.status(500).json({ error: "Bağlantı koptu: " + error.message });
    }
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { message } = req.body || {};
    // TOKEN'I BURAYA YAPIŞTIR
    const TOKEN = "hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; 

    try {
        const response = await fetch("https://router.huggingface.co/hf-inference/models/HuggingFaceH4/zephyr-7b-beta", {
            headers: { 
                "Authorization": `Bearer ${TOKEN}`,
                "Content-Type": "application/json",
                "User-Agent": "MahoxAI-App" // Bazı serverlar bunu görmezse 404 atar
            },
            method: "POST",
            body: JSON.stringify({ 
                inputs: `<|system|>\nSen MAHOXAI isminde zeki bir mahalle abisisin.</s>\n<|user|>\n${message}</s>\n<|assistant|>`,
                parameters: { max_new_tokens: 200 }
            }),
        });

        // İşte burası kritik: Eğer cevap JSON değilse patlamasın diye kontrol ediyoruz
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const errorText = await response.text();
            return res.status(500).json({ error: "HuggingFace JSON yerine HTML döndürdü! Mesaj: " + errorText.substring(0, 50) });
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Bağlantı Hatası: " + error.message });
    }
}

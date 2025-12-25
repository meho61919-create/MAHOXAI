export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const TOKEN = "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"; // Senin yeni token
    const { message } = req.body || {};

    try {
        const response = await fetch("https://router.huggingface.co/hf-inference/models/HuggingFaceH4/zephyr-7b-beta", {
            headers: { 
                "Authorization": `Bearer ${TOKEN}`,
                "Content-Type": "application/json" 
            },
            method: "POST",
            body: JSON.stringify({ 
                inputs: `<|system|>\nSen MAHOXAI isminde zeki bir mahalle abisisin.</s>\n<|user|>\n${message}</s>\n<|assistant|>`,
                parameters: { max_new_tokens: 200 }
            }),
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({ error: "İç hata: " + e.message });
    }
}

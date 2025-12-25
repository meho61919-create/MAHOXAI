// EN ÜSTTE HİÇBİR İMPORT VEYA REQUİRE OLMAYACAK!
export const handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Sadece POST ağa!" };
    }

    try {
        const { message } = JSON.parse(event.body);
        const TOKEN = "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"; // Senin Token

        // Doğrudan fetch kullanıyoruz, kütüphane istemez!
        const response = await fetch("https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.3", {
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

        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(data)
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Sistem hatası: " + error.message })
        };
    }
};

const fetch = require('node-fetch'); // Netlify bunu otomatik halleder

exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Sadece POST ağa!" };
    }

    const { message } = JSON.parse(event.body);
    const TOKEN = "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"; // Senin Token

    try {
        const response = await fetch("https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.3", {
            headers: { 
                "Authorization": `Bearer ${TOKEN}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ 
                inputs: `<s>[INST] Sen MAHOXAI isminde zeki bir mahalle abisisin. [/INST] Tamam kardeş.</s> [INST] ${message} [/INST]`,
                parameters: { max_new_tokens: 300 }
            }),
        });

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};

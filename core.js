// core.js - MAHOXAI BACKEND CONNECT
async function askMahox(userMessage) {
    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage }),
        });

        const result = await response.json();

        if (Array.isArray(result) && result[0].generated_text) {
            return result[0].generated_text.split("<|assistant|>").pop().trim();
        }
        return "Ağa motor bir öksürdü, tekrar dene!";
    } catch (error) {
        return "Bağlantı koptu ağa, backend'i kontrol et!";
    }
}

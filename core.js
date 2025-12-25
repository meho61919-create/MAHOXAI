async function askMahox(userInput) {
    const API_TOKEN = localStorage.getItem("MAHOX_TOKEN"); 
    const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

    if (!API_TOKEN) return "Ağa önce token'ı Console'dan setToken ile gir!";

    try {
        console.log("MAHOX sinyali gönderiyor...");
        
        // CORS'u aşmak için 'no-cors' DENEMİYORUZ (çünkü o zaman cevap okunmaz)
        // Bunun yerine doğrudan API'ye en sade haliyle vuruyoruz
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${API_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                inputs: userInput,
                parameters: { wait_for_model: true }
            })
        });

        // Eğer hala CORS hatası veriyorsa, köprüyü (proxy) zorunlu kullanacağız
        if (!response.ok) {
            console.warn("Normal yol tıkalı, yedek köprü deneniyor...");
            return await yedekKopruDene(userInput, API_TOKEN);
        }

        const result = await response.json();
        return result[0].generated_text || "Cevap boş.";

    } catch (error) {
        console.error("Ana hat tıkalı, yedek devreye giriyor...");
        return await yedekKopruDene(userInput, API_TOKEN);
    }
}

// CORS engelini aşmak için dünyaca ünlü ücretsiz köprü
async function yedekKopruDene(userInput, token) {
    const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";
    const PROXY_URL = "https://cors-anywhere.herokuapp.com/"; // Eğer bu çalışmazsa 'https://corsproxy.io/?' dene

    try {
        const res = await fetch(PROXY_URL + API_URL, {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            },
            body: JSON.stringify({ inputs: userInput })
        });
        
        const data = await res.json();
        return data[0].generated_text || "MAHOX yorgun düştü.";
    } catch (e) {
        return "Ağa bütün yollar kapalı! Son bir hamle kaldı: Tarayıcına 'Allow CORS' eklentisi kurup dene.";
    }
}

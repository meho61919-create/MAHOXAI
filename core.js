async function askMahox(userInput) {
    // Console'dan 'setToken("AIza...")' diyerek Gemini key'ini kaydet
    const API_KEY = localStorage.getItem("MAHOX_TOKEN"); 
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    if (!API_KEY) return "Ağa önce Gemini API Key girmen lazım!";

    try {
        console.log("MAHOX (Gemini) cevap hazırlıyor...");
        
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userInput }] }]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            return data.candidates[0].content.parts[0].text;
        }
        
        return "Ağa cevap gelmedi, limiti mi aştık n'aptık?";
    } catch (error) {
        console.error("Gemini Hatası:", error);
        return "Google mahallesine ulaşılamıyor, anahtarı kontrol et!";
    }
}

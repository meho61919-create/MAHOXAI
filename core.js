// MAHOXAI - HIZLI BAĞLANTI SİSTEMİ
const API_KEY = "AIzaSyDW6R00ldFZhsQKboQpu8lV1Jp7OIlq-G8"; // Gemini Key'ini buraya koy ağa
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

async function askMahox(userInput) {
    try {
        console.log("MAHOX (Gemini) cevap hazırlıyor...");
        
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: `Sen MAHOXAI adında, mahalle usulü konuşan, samimi bir yapay zekasın. Kullanıcıya "ağa, reis, kral" gibi hitaplar kullanabilirsin. Kullanıcı mesajı: ${userInput}` }] 
                }]
            })
        });

        const data = await response.json();
        
        // Google'dan gelen veriyi ayıklıyoruz
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            return data.candidates[0].content.parts[0].text;
        }
        
        return "Ağa bir pürüz çıktı, cevap gelmedi.";
    } catch (error) {
        console.error("Hata:", error);
        return "Sinyal kesildi! Token'ı veya interneti kontrol et reis.";
    }
}

// dashboard.html'den gelen mesajı karşılayan ana fonksiyonun (Eğer ismi farklıysa dashboard'dakiyle aynı yap)
async function send() {
    const inputField = document.getElementById("user-input"); // Senin input ID'n neyse o
    const message = inputField.value;
    if(!message) return;

    // Ekrana kullanıcı mesajını yazdır (Varsayılan fonksiyonun varsa onu kullan)
    // appendMessage(message, "user"); 

    const response = await askMahox(message);
    
    // Ekrana MAHOX cevabını yazdır
    // appendMessage(response, "mahox");
    
    inputField.value = "";
}

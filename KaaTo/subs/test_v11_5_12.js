// Test script para verificar KaaTo v11.5.12
// Test directo de las funciones principales

console.log('🚀 Testing KaaTo Universal v11.5.12');

// Simulación de fetchv2 para testing
global.fetchv2 = async (url, headers = {}, method = 'GET', body = null) => {
    console.log(`FETCH: ${method} ${url}`);
    if (body) console.log('BODY:', body);
    
    // Simular respuesta basada en URL
    if (url.includes('/api/search')) {
        return {
            json: async () => [
                {
                    "slug": "dandadan-da3b",
                    "title": "Dandadan",
                    "title_en": "Dan Da Dan",
                    "year": 2024,
                    "poster": {
                        "hq": "dandadan-b585-hq"
                    }
                }
            ]
        };
    }
    
    if (url.includes('/api/show/dandadan-da3b')) {
        return {
            json: async () => ({
                "title": "Dandadan",
                "title_en": "Dan Da Dan",
                "title_original": "ダンダダン",
                "year": 2024,
                "synopsis": "Reeling from her recent breakup, Momo Ayase shows kindness to her socially awkward schoolmate...",
                "locales": ["ja-JP", "en-US", "es-ES"]
            })
        };
    }
    
    if (url.includes('/episodes?ep=1&lang=')) {
        return {
            json: async () => ({
                "current_page": 1,
                "pages": [{"number": 1, "from": "01", "to": "12", "eps": [1,2,3,4,5,6,7,8,9,10,11,12]}],
                "result": [
                    {
                        "slug": "b324b5",
                        "title": "That's How Love Starts, Ya Know!",
                        "episode_number": 1,
                        "episode_string": "1"
                    },
                    {
                        "slug": "d4ae7b", 
                        "title": "That's a Space Alien, Ain't It?!",
                        "episode_number": 2,
                        "episode_string": "2"
                    }
                ]
            })
        };
    }
    
    if (url.includes('dandadan-da3b/ep-1-b324b5')) {
        return {
            text: async () => `
                <html>
                <head><title>DanDaDan Episode 1</title></head>
                <body>
                    <script>
                        window.videoId = "507f1f77bcf86cd799439011";
                        const manifest = "https://hls.krussdomi.com/manifest/507f1f77bcf86cd799439011/master.m3u8";
                    </script>
                </body>
                </html>
            `
        };
    }
    
    // Default fallback
    return {
        json: async () => ({}),
        text: async () => '',
        status: 404
    };
};

// Cargar el módulo
const fs = require('fs');
const moduleCode = fs.readFileSync('./KaaTo_UNIVERSAL_FIXED_v11_5_11.js', 'utf8');
eval(moduleCode);

// Test principal
async function runTests() {
    console.log('\n🔍 Testing Search...');
    const searchResult = await searchResults('dandadan');
    console.log('Search Result:', searchResult);
    
    console.log('\n📄 Testing Details...');
    const detailResult = await extractDetails('https://kaa.to/anime/dandadan-da3b');
    console.log('Detail Result:', detailResult);
    
    console.log('\n📺 Testing Episodes...');
    const episodesResult = await extractEpisodes('https://kaa.to/anime/dandadan-da3b');
    console.log('Episodes Result:', episodesResult);
    
    console.log('\n📺 Testing Episodes with real format...');
    const episodesResult2 = await extractEpisodes('https://kaa.to/dandadan-da3b/ep-1-b324b5');
    console.log('Episodes Result 2:', episodesResult2);
    
    console.log('\n🎬 Testing Stream...');
    const streamResult = await extractStreamUrl('https://kaa.to/dandadan-da3b/ep-1-b324b5');
    console.log('Stream Result:', streamResult);
    
    console.log('\n✅ All tests completed!');
}

runTests().catch(console.error);

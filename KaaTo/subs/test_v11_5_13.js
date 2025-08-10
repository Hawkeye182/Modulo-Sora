// Test script para KaaTo v11.5.13 - AUTH FIX
console.log('🧪 Testing KaaTo v11.5.13 with authentication headers...');

// Simulación de fetchv2 para testing
global.fetchv2 = async (url, headers, method = 'GET', body = null) => {
    console.log(`🌐 Mock API call: ${method} ${url}`);
    console.log('📋 Headers:', headers);
    
    if (url.includes('/api/search')) {
        return {
            text: JSON.stringify([
                {
                    title: "DanDaDan",
                    image: "https://kaa.to/image/poster/dandadan-da3b-hq.webp",
                    href: "https://kaa.to/anime/dandadan-da3b"
                }
            ])
        };
    }
    
    if (url.includes('/api/show/dandadan-da3b')) {
        return {
            text: JSON.stringify({
                show: {
                    title: "DanDaDan",
                    title_japanese: "ダンダダン",
                    synopsis: "Un anime sobre alienígenas y fantasmas...",
                    year: 2024,
                    poster: { hq: "dandadan-da3b-hq" }
                },
                locales: ["ja-JP", "en-US"]
            })
        };
    }
    
    if (url.includes('/episodes?ep=1&lang=ja-JP')) {
        return {
            text: JSON.stringify({
                result: [
                    { episode_number: 1, slug: "b324b5", title: "Episode 1" },
                    { episode_number: 2, slug: "d4ae7b", title: "Episode 2" }
                ]
            })
        };
    }
    
    if (url.includes('/episodes/1?lang=ja-JP')) {
        return {
            text: JSON.stringify({
                video_id: "507f1f77bcf86cd799439011", // Example 24-char hex
                manifest_url: "https://hls.krussdomi.com/manifest/507f1f77bcf86cd799439011/master.m3u8"
            })
        };
    }
    
    if (url.includes('dandadan-da3b/ep-1-b324b5')) {
        return {
            text: `
            <!DOCTYPE html>
            <html>
            <head><title>DanDaDan Episode 1</title></head>
            <body>
                <script>
                    var videoId = "507f1f77bcf86cd799439011";
                    var manifestUrl = "https://hls.krussdomi.com/manifest/507f1f77bcf86cd799439011/master.m3u8";
                </script>
            </body>
            </html>
            `
        };
    }
    
    if (url.includes('master.m3u8')) {
        return { status: 200 };
    }
    
    return { text: '{}' };
};

// Cargar el módulo
const fs = require('fs');
const path = require('path');

// Leer y evaluar el contenido del módulo
const moduleContent = fs.readFileSync('./KaaTo_UNIVERSAL_FIXED_v11_5_13.js', 'utf8');
eval(moduleContent);

async function runTests() {
    console.log('\n🔍 Test 1: Search functionality');
    const searchResult = await searchResults('DanDaDan');
    const searchData = JSON.parse(searchResult);
    console.log('✅ Search result:', searchData[0]?.title);
    
    console.log('\n📄 Test 2: Extract details');
    const detailsResult = await extractDetails('https://kaa.to/anime/dandadan-da3b');
    const detailsData = JSON.parse(detailsResult);
    console.log('✅ Details result:', detailsData[0]?.title, '-', detailsData[0]?.airdate);
    
    console.log('\n📺 Test 3: Extract episodes');
    const episodesResult = await extractEpisodes('https://kaa.to/anime/dandadan-da3b');
    const episodesData = JSON.parse(episodesResult);
    console.log('✅ Episodes result:', episodesData.length, 'episodes found');
    console.log('   First episode:', episodesData[0]?.href);
    
    console.log('\n🎥 Test 4: Extract stream URL');
    const streamResult = await extractStreamUrl('https://kaa.to/dandadan-da3b/ep-1-b324b5');
    console.log('✅ Stream result:', streamResult);
    
    console.log('\n🎉 All tests completed!');
}

runTests().catch(console.error);

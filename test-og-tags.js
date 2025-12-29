const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Script de test pour vérifier les métadonnées Open Graph
 * Usage: node test-og-tags.js
 */

const testUrls = [
    'http://localhost:7200/',
    'http://localhost:7200/article/votre-slug-article-ici'
];

async function testOGTags(url) {
    console.log('\n' + '='.repeat(80));
    console.log(`🔍 Test de l'URL: ${url}`);
    console.log('='.repeat(80));
    
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        
        // Récupérer toutes les métadonnées importantes
        const metadata = {
            title: $('title').text(),
            description: $('meta[name="description"]').attr('content'),
            ogTitle: $('meta[property="og:title"]').attr('content'),
            ogDescription: $('meta[property="og:description"]').attr('content'),
            ogImage: $('meta[property="og:image"]').attr('content'),
            ogImageSecure: $('meta[property="og:image:secure_url"]').attr('content'),
            ogImageWidth: $('meta[property="og:image:width"]').attr('content'),
            ogImageHeight: $('meta[property="og:image:height"]').attr('content'),
            ogUrl: $('meta[property="og:url"]').attr('content'),
            ogType: $('meta[property="og:type"]').attr('content'),
            twitterCard: $('meta[name="twitter:card"]').attr('content'),
            twitterTitle: $('meta[name="twitter:title"]').attr('content'),
            twitterDescription: $('meta[name="twitter:description"]').attr('content'),
            twitterImage: $('meta[name="twitter:image"]').attr('content')
        };
        
        // Afficher les résultats
        console.log('\n📄 Métadonnées de base:');
        console.log(`  Title: ${metadata.title}`);
        console.log(`  Description: ${metadata.description?.substring(0, 100)}...`);
        
        console.log('\n🌐 Open Graph (Facebook/WhatsApp):');
        console.log(`  og:title: ${metadata.ogTitle}`);
        console.log(`  og:description: ${metadata.ogDescription?.substring(0, 100)}...`);
        console.log(`  og:image: ${metadata.ogImage}`);
        console.log(`  og:image:secure_url: ${metadata.ogImageSecure}`);
        console.log(`  og:image:width: ${metadata.ogImageWidth}`);
        console.log(`  og:image:height: ${metadata.ogImageHeight}`);
        console.log(`  og:url: ${metadata.ogUrl}`);
        console.log(`  og:type: ${metadata.ogType}`);
        
        console.log('\n🐦 Twitter Card:');
        console.log(`  twitter:card: ${metadata.twitterCard}`);
        console.log(`  twitter:title: ${metadata.twitterTitle}`);
        console.log(`  twitter:description: ${metadata.twitterDescription?.substring(0, 100)}...`);
        console.log(`  twitter:image: ${metadata.twitterImage}`);
        
        // Vérifications
        console.log('\n✅ Vérifications:');
        const checks = {
            'Titre présent': !!metadata.title && !metadata.title.includes('{{'),
            'Description présente': !!metadata.description && !metadata.description.includes('{{'),
            'Image Open Graph': !!metadata.ogImage && metadata.ogImage.startsWith('http'),
            'Image sécurisée': !!metadata.ogImageSecure && metadata.ogImageSecure.startsWith('https'),
            'Dimensions image': !!metadata.ogImageWidth && !!metadata.ogImageHeight,
            'URL canonique': !!metadata.ogUrl && metadata.ogUrl.startsWith('http'),
            'Twitter Card': metadata.twitterCard === 'summary_large_image',
            'Image Twitter': !!metadata.twitterImage && metadata.twitterImage.startsWith('http')
        };
        
        let allPassed = true;
        for (const [check, passed] of Object.entries(checks)) {
            const icon = passed ? '✅' : '❌';
            console.log(`  ${icon} ${check}`);
            if (!passed) allPassed = false;
        }
        
        if (allPassed) {
            console.log('\n🎉 Tous les tests sont passés !');
        } else {
            console.log('\n⚠️  Certains tests ont échoué. Vérifiez les métadonnées ci-dessus.');
        }
        
        // Test de l'image
        if (metadata.ogImage) {
            console.log('\n🖼️  Test de l\'image:');
            try {
                const imageResponse = await axios.head(metadata.ogImage);
                console.log(`  ✅ Image accessible (Status: ${imageResponse.status})`);
                console.log(`  Type: ${imageResponse.headers['content-type']}`);
                const sizeKB = parseInt(imageResponse.headers['content-length']) / 1024;
                console.log(`  Taille: ${sizeKB.toFixed(2)} KB`);
                
                if (sizeKB > 5000) {
                    console.log('  ⚠️  Attention: Image > 5MB, peut être trop lourde pour le partage');
                } else if (sizeKB > 1000) {
                    console.log('  ℹ️  Image > 1MB, considérez une optimisation');
                }
            } catch (error) {
                console.log(`  ❌ Erreur d'accès à l'image: ${error.message}`);
            }
        }
        
        return true;
        
    } catch (error) {
        console.error(`\n❌ Erreur lors du test: ${error.message}`);
        return false;
    }
}

async function runAllTests() {
    console.log('\n🚀 Démarrage des tests des métadonnées Open Graph');
    console.log('⏰ ' + new Date().toLocaleString('fr-FR'));
    
    let passedTests = 0;
    
    for (const url of testUrls) {
        const passed = await testOGTags(url);
        if (passed) passedTests++;
    }
    
    console.log('\n' + '='.repeat(80));
    console.log(`📊 Résumé: ${passedTests}/${testUrls.length} tests réussis`);
    console.log('='.repeat(80));
    
    if (passedTests === testUrls.length) {
        console.log('\n✨ Félicitations! Tous les tests sont passés.');
        console.log('\n📱 Prochaines étapes:');
        console.log('  1. Testez avec Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/');
        console.log('  2. Testez avec Twitter Card Validator: https://cards-dev.twitter.com/validator');
        console.log('  3. Partagez un lien sur WhatsApp pour vérifier l\'aperçu');
    } else {
        console.log('\n⚠️  Certains tests ont échoué. Vérifiez la configuration.');
    }
}

// Exécuter les tests
runAllTests().catch(console.error);

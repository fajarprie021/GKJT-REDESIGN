// Native fetch is available in Node.js 18+
// const fetch = require('node-fetch'); // Removed dependency

// Base URL
const BASE_URL = 'http://localhost:3000/api';

async function verifyEndpoint(name, url, checkFn = null) {
    try {
        const res = await fetch(`${BASE_URL}${url}`);
        const data = await res.json();

        if (data.status === 'success') {
            console.log(`✅ [PASS] ${name} API is accessible`);
            if (checkFn) {
                checkFn(data.data);
            }
        } else {
            console.error(`❌ [FAIL] ${name} API returned error:`, data.message);
        }
    } catch (error) {
        console.error(`❌ [FAIL] ${name} API network error:`, error.message);
    }
}

async function runVerification() {
    console.log('🚀 Starting Full System Verification...\n');

    // 1. Verify Renungan
    await verifyEndpoint('Renungan', '/renungan', (data) => {
        if (data.length > 0) {
            console.log(`   found ${data.length} items.`);
            if (!data[0].renungan_judul) console.error('   ❌ Missing renungan_judul field!');
        } else {
            console.warn('   ⚠️ No data found (empty table?)');
        }
    });

    // 2. Verify Agenda
    await verifyEndpoint('Agenda', '/agenda', (data) => {
        if (data.length > 0) {
            console.log(`   found ${data.length} items.`);
        }
    });

    // 3. Verify Galeri & Album Relation
    // Galeri items SHOULD have album_nama (joined field)
    await verifyEndpoint('Galeri (with Album Relation)', '/galeri', (data) => {
        if (data.length > 0) {
            const missingRelation = data.filter(item => !item.album_nama);
            if (missingRelation.length > 0) {
                console.error(`   ❌ Relation Error: ${missingRelation.length} gallery items have no album name!`);
            } else {
                console.log('   ✅ Relation Check: All gallery items have associated Album Name.');
            }
        }
    });

    // 4. Verify Slider (Images)
    // Check if image paths are valid file names
    await verifyEndpoint('Slider', '/slider', (data) => {
        if (data.length > 0) {
            const validImages = data.filter(item => item.gambar && item.gambar.length > 4);
            console.log(`   found ${validImages.length}/${data.length} items with valid image filenames.`);
        }
    });

    // 5. Verify Users (Admin)
    await verifyEndpoint('Users', '/users', (data) => {
        if (data.length > 0) {
            console.log('   ✅ Users table accessible.');
        }
    });

    // 6. Verify Static Content
    await verifyEndpoint('Sejarah', '/sejarah');
    await verifyEndpoint('Visi Misi', '/visi-misi');

    console.log('\n✅ Verification Complete.');
}

runVerification();

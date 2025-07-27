const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const http = require('http');

function testDatabase() {
    return new Promise((resolve, reject) => {
        console.log('=== Testing Database ===');
        
        const db = new sqlite3.Database('umamusume_cards.db', sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                console.error('❌ Database error:', err.message);
                reject(false);
                return;
            }
            
            // Count total cards
            db.get('SELECT COUNT(*) as count FROM cards', [], (err, row) => {
                if (err) {
                    console.error('❌ Error counting cards:', err.message);
                    reject(false);
                    return;
                }
                
                console.log(`✅ Total cards in database: ${row.count}`);
                
                // Check cards with images
                db.get('SELECT COUNT(*) as count FROM cards WHERE image_data IS NOT NULL', [], (err, row) => {
                    if (err) {
                        console.error('❌ Error counting cards with images:', err.message);
                        reject(false);
                        return;
                    }
                    
                    console.log(`✅ Cards with images: ${row.count}`);
                    
                    // Check cards without images
                    db.get('SELECT COUNT(*) as count FROM cards WHERE image_data IS NULL', [], (err, row) => {
                        if (err) {
                            console.error('❌ Error counting cards without images:', err.message);
                            reject(false);
                            return;
                        }
                        
                        console.log(`⚠️  Cards without images: ${row.count}`);
                        
                        if (row.count > 0) {
                            db.all('SELECT name, image_path FROM cards WHERE image_data IS NULL', [], (err, rows) => {
                                if (err) {
                                    console.error('❌ Error getting missing images:', err.message);
                                } else {
                                    console.log('Missing images:');
                                    rows.forEach(row => {
                                        console.log(`  - ${row.name}: ${row.image_path}`);
                                    });
                                }
                                
                                // Test a few sample cards
                                db.all('SELECT name, type, rate FROM cards LIMIT 5', [], (err, rows) => {
                                    if (err) {
                                        console.error('❌ Error getting sample cards:', err.message);
                                    } else {
                                        console.log('\nSample cards:');
                                        rows.forEach(row => {
                                            console.log(`  - ${row.name} (${row.type}): ${row.rate}%`);
                                        });
                                    }
                                    
                                    db.close();
                                    resolve(true);
                                });
                            });
                        } else {
                            // Test a few sample cards
                            db.all('SELECT name, type, rate FROM cards LIMIT 5', [], (err, rows) => {
                                if (err) {
                                    console.error('❌ Error getting sample cards:', err.message);
                                } else {
                                    console.log('\nSample cards:');
                                    rows.forEach(row => {
                                        console.log(`  - ${row.name} (${row.type}): ${row.rate}%`);
                                    });
                                }
                                
                                db.close();
                                resolve(true);
                            });
                        }
                    });
                });
            });
        });
    });
}

function testApiServer() {
    return new Promise((resolve) => {
        console.log('\n=== Testing API Server ===');
        
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/cards',
            method: 'GET'
        };
        
        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const cards = JSON.parse(data);
                        console.log(`✅ API cards endpoint: ${cards.length} cards returned`);
                        
                        // Test first card image
                        if (cards.length > 0) {
                            const firstCard = cards[0];
                            const imageUrl = `/api/cards/${firstCard.id}/image`;
                            console.log(`Testing image URL: ${imageUrl}`);
                            
                            const imgOptions = {
                                hostname: 'localhost',
                                port: 3000,
                                path: imageUrl,
                                method: 'GET'
                            };
                            
                            const imgReq = http.request(imgOptions, (imgRes) => {
                                let imgData = '';
                                imgRes.on('data', (chunk) => {
                                    imgData += chunk;
                                });
                                imgRes.on('end', () => {
                                    if (imgRes.statusCode === 200) {
                                        console.log(`✅ Image loading: ${imgData.length} bytes`);
                                    } else {
                                        console.log(`❌ Image loading failed: ${imgRes.statusCode}`);
                                    }
                                    resolve(true);
                                });
                            });
                            
                            imgReq.on('error', (err) => {
                                console.log(`❌ Image request error: ${err.message}`);
                                resolve(false);
                            });
                            
                            imgReq.end();
                        } else {
                            resolve(true);
                        }
                    } catch (err) {
                        console.log(`❌ JSON parse error: ${err.message}`);
                        resolve(false);
                    }
                } else {
                    console.log(`❌ API cards endpoint failed: ${res.statusCode}`);
                    resolve(false);
                }
            });
        });
        
        req.on('error', (err) => {
            console.log('❌ API server not running. Start it with: npm start');
            resolve(false);
        });
        
        req.end();
    });
}

function testFilePaths() {
    console.log('\n=== Testing File Paths ===');
    
    // Test card images
    const cardImagesDir = 'assets/SSR/Border';
    if (fs.existsSync(cardImagesDir)) {
        const cardFiles = fs.readdirSync(cardImagesDir);
        console.log(`✅ Card images directory: ${cardFiles.length} files`);
    } else {
        console.log(`❌ Card images directory not found: ${cardImagesDir}`);
    }
    
    // Test type icons
    const typeIconsDir = 'assets/stats/border';
    if (fs.existsSync(typeIconsDir)) {
        const typeFiles = fs.readdirSync(typeIconsDir);
        console.log(`✅ Type icons directory: ${typeFiles.length} files`);
        console.log(`  Files: ${typeFiles.join(', ')}`);
    } else {
        console.log(`❌ Type icons directory not found: ${typeIconsDir}`);
    }
}

function testWebInterface() {
    return new Promise((resolve) => {
        console.log('\n=== Testing Web Interface ===');
        
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/database',
            method: 'GET'
        };
        
        const req = http.request(options, (res) => {
            if (res.statusCode === 200) {
                console.log('✅ Database version HTML accessible');
            } else {
                console.log(`❌ Database version HTML: ${res.statusCode}`);
            }
            
            // Test original version
            const gachaOptions = {
                hostname: 'localhost',
                port: 3000,
                path: '/gacha',
                method: 'GET'
            };
            
            const gachaReq = http.request(gachaOptions, (gachaRes) => {
                if (gachaRes.statusCode === 200) {
                    console.log('✅ Original version HTML accessible');
                } else {
                    console.log(`❌ Original version HTML: ${gachaRes.statusCode}`);
                }
                resolve(true);
            });
            
            gachaReq.on('error', (err) => {
                console.log('❌ HTTP server not running. Start it with: npm start');
                resolve(false);
            });
            
            gachaReq.end();
        });
        
        req.on('error', (err) => {
            console.log('❌ HTTP server not running. Start it with: npm start');
            resolve(false);
        });
        
        req.end();
    });
}

async function main() {
    console.log('Umamusume Database Test Suite');
    console.log('='.repeat(40));
    
    // Test database
    const dbOk = await testDatabase();
    
    // Test file paths
    testFilePaths();
    
    // Test API server (if running)
    const apiOk = await testApiServer();
    
    // Test web interface (if running)
    const webOk = await testWebInterface();
    
    console.log('\n' + '='.repeat(40));
    console.log('SUMMARY:');
    console.log(`Database: ${dbOk ? '✅ OK' : '❌ FAILED'}`);
    console.log(`API Server: ${apiOk ? '✅ OK' : '❌ NOT RUNNING'}`);
    console.log(`Web Interface: ${webOk ? '✅ OK' : '❌ NOT RUNNING'}`);
    console.log('\nTo start server:');
    console.log('1. Install dependencies: npm install');
    console.log('2. Setup database: npm run setup');
    console.log('3. Start server: npm start');
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { testDatabase, testApiServer, testFilePaths, testWebInterface }; 
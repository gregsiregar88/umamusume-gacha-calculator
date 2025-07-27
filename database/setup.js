const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

function createDatabase() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('umamusume_cards.db', (err) => {
            if (err) {
                reject(err);
                return;
            }
            
            console.log('✅ Connected to SQLite database');
            
            // Create cards table
            db.run(`
                CREATE TABLE IF NOT EXISTS cards (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL UNIQUE,
                    rarity TEXT NOT NULL,
                    rate REAL NOT NULL,
                    type TEXT NOT NULL,
                    image_path TEXT,
                    image_data BLOB,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                // Create indexes for better performance
                db.run('CREATE INDEX IF NOT EXISTS idx_type ON cards(type)', (err) => {
                    if (err) console.warn('Warning creating type index:', err.message);
                });
                
                db.run('CREATE INDEX IF NOT EXISTS idx_rarity ON cards(rarity)', (err) => {
                    if (err) console.warn('Warning creating rarity index:', err.message);
                });
                
                db.run('CREATE INDEX IF NOT EXISTS idx_rate ON cards(rate)', (err) => {
                    if (err) console.warn('Warning creating rate index:', err.message);
                });
                
                resolve(db);
            });
        });
    });
}

function loadImagesToDatabase(db) {
    return new Promise((resolve, reject) => {
        try {
            // Read the JSON data
            const cardsData = JSON.parse(fs.readFileSync('src/support_gacha_rates.json', 'utf8'));
            
            let loadedCount = 0;
            let errorCount = 0;
            
            cardsData.forEach((card, index) => {
                const imagePath = `assets/${card.image}`;
                
                // Check if image file exists
                if (fs.existsSync(imagePath)) {
                    const imageData = fs.readFileSync(imagePath);
                    
                    // Insert card data with image
                    db.run(`
                        INSERT OR REPLACE INTO cards (name, rarity, rate, type, image_path, image_data)
                        VALUES (?, ?, ?, ?, ?, ?)
                    `, [
                        card.name,
                        card.rarity,
                        card.rate,
                        card.type,
                        card.image,
                        imageData
                    ], function(err) {
                        if (err) {
                            console.error(`❌ Error inserting ${card.name}:`, err.message);
                            errorCount++;
                        } else {
                            loadedCount++;
                        }
                        
                        // Check if all cards have been processed
                        if (loadedCount + errorCount === cardsData.length) {
                            console.log(`✅ Loaded ${loadedCount} cards into database`);
                            if (errorCount > 0) {
                                console.log(`⚠️  ${errorCount} cards had errors`);
                            }
                            resolve();
                        }
                    });
                } else {
                    // Insert card data without image if file doesn't exist
                    db.run(`
                        INSERT OR REPLACE INTO cards (name, rarity, rate, type, image_path)
                        VALUES (?, ?, ?, ?, ?)
                    `, [
                        card.name,
                        card.rarity,
                        card.rate,
                        card.type,
                        card.image
                    ], function(err) {
                        if (err) {
                            console.error(`❌ Error inserting ${card.name}:`, err.message);
                            errorCount++;
                        } else {
                            loadedCount++;
                        }
                        
                        // Check if all cards have been processed
                        if (loadedCount + errorCount === cardsData.length) {
                            console.log(`✅ Loaded ${loadedCount} cards into database`);
                            if (errorCount > 0) {
                                console.log(`⚠️  ${errorCount} cards had errors`);
                            }
                            resolve();
                        }
                    });
                }
            });
            
        } catch (err) {
            reject(err);
        }
    });
}

async function main() {
    try {
        console.log('Setting up Umamusume Cards Database...');
        
        // Create database
        const db = await createDatabase();
        console.log('✅ Database created successfully');
        
        // Load data
        await loadImagesToDatabase(db);
        console.log('✅ Data loaded successfully');
        
        // Close connection
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            } else {
                console.log('✅ Database connection closed');
            }
        });
        
        console.log('\n🎉 Setup complete! To run the server:');
        console.log('1. Install dependencies: npm install');
        console.log('2. Run server: npm start');
        console.log('3. Access at: http://localhost:3000');
        
    } catch (err) {
        console.error('❌ Setup failed:', err.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { createDatabase, loadImagesToDatabase }; 
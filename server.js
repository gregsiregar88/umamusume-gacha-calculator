const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const { config, getImageUrl } = require('./config');

const app = express();
const PORT = config.server.port;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Database connection
function getDbConnection() {
    return new sqlite3.Database('umamusume_cards.db', sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        }
    });
}

// API Routes
app.get('/api/cards', (req, res) => {
    const db = getDbConnection();
    
    db.all('SELECT id, name, rarity, rate, type, image_path FROM cards ORDER BY name', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        const cards = rows.map(row => ({
            id: row.id,
            name: row.name,
            rarity: row.rarity,
            rate: row.rate,
            type: row.type,
            image: getImageUrl(row.image_path)
        }));
        
        res.json(cards);
    });
    
    db.close();
});

app.get('/api/cards/:id/image', (req, res) => {
    const cardId = req.params.id;
    const db = getDbConnection();
    
    db.get('SELECT image_data, name FROM cards WHERE id = ?', [cardId], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (row && row.image_data) {
            res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Content-Disposition', `inline; filename="${row.name}.svg"`);
            res.send(row.image_data);
        } else {
            res.status(404).send('Image not found');
        }
    });
    
    db.close();
});

app.get('/api/cards/type/:type', (req, res) => {
    const cardType = req.params.type;
    const db = getDbConnection();
    
    db.all('SELECT id, name, rarity, rate, type, image_path FROM cards WHERE type = ? ORDER BY name', [cardType], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        const cards = rows.map(row => ({
            id: row.id,
            name: row.name,
            rarity: row.rarity,
            rate: row.rate,
            type: row.type,
            image: getImageUrl(row.image_path)
        }));
        
        res.json(cards);
    });
    
    db.close();
});

// Serve main pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'gacha_database.html'));
});

app.get('/gacha', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'gacha.html'));
});

app.get('/database', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'gacha_database.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📊 Database version: http://localhost:${PORT}/database`);
    console.log(`🎰 Original version: http://localhost:${PORT}/gacha`);
    console.log(`🔧 API endpoints: http://localhost:${PORT}/api/cards`);
    console.log('Press Ctrl+C to stop the server');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    process.exit(0);
}); 
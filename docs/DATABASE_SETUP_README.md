# Umamusume Cards Database Setup

This guide explains how to move your card data and images from JSON files to a database system.

## Overview

The database approach provides several benefits:
- **Better performance** for large datasets
- **Easier data management** and updates
- **Scalability** for future features
- **Centralized data storage**
- **API endpoints** for flexible access

## Option 1: SQLite Database (Recommended)

### Step 1: Set up the Database

1. **Run the setup script:**
   ```bash
   python database_setup.py
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the API server:**
   ```bash
   python api_server.py
   ```

### Step 2: Update Your HTML

Replace the script reference in your HTML file:

```html
<!-- Change this line in gacha.html -->
<script src="gacha_database.js"></script>
```

### Step 3: Test the Setup

1. Open your browser to `http://localhost:5000/api/cards`
2. You should see JSON data with all your cards
3. Test image loading: `http://localhost:5000/api/cards/1/image`

## Option 2: PostgreSQL Database (For Production)

If you want a more robust database for production use:

### Step 1: Install PostgreSQL

```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS
brew install postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

### Step 2: Create Database Schema

```sql
CREATE DATABASE umamusume_cards;

CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    rarity VARCHAR(50) NOT NULL,
    rate DECIMAL(10,6) NOT NULL,
    type VARCHAR(50) NOT NULL,
    image_path TEXT,
    image_data BYTEA,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cards_type ON cards(type);
CREATE INDEX idx_cards_rarity ON cards(rarity);
CREATE INDEX idx_cards_rate ON cards(rate);
```

### Step 3: Use PostgreSQL API

Create a new API file (`postgres_api.py`):

```python
import psycopg2
from flask import Flask, jsonify, send_file
from flask_cors import CORS
import io

app = Flask(__name__)
CORS(app)

def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        database="umamusume_cards",
        user="your_username",
        password="your_password"
    )

@app.route('/api/cards', methods=['GET'])
def get_cards():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT id, name, rarity, rate, type, image_path 
        FROM cards 
        ORDER BY name
    ''')
    
    cards = []
    for row in cursor.fetchall():
        cards.append({
            'id': row[0],
            'name': row[1],
            'rarity': row[2],
            'rate': float(row[3]),
            'type': row[4],
            'image': f'/api/cards/{row[0]}/image'
        })
    
    cursor.close()
    conn.close()
    return jsonify(cards)

# ... rest of the API endpoints similar to SQLite version
```

## Option 3: Cloud Database (AWS, Google Cloud, etc.)

For cloud deployment, consider:

### AWS RDS (PostgreSQL)
- Managed database service
- Automatic backups
- High availability
- Scalable

### Google Cloud SQL
- Similar benefits to AWS RDS
- Easy integration with other Google services

### MongoDB Atlas
- NoSQL option
- Good for document-based data
- Easy scaling

## API Endpoints

The database API provides these endpoints:

- `GET /api/cards` - Get all cards
- `GET /api/cards/{id}/image` - Get card image
- `GET /api/cards/type/{type}` - Get cards by type

## Benefits of Database Approach

1. **Performance**: Faster queries with indexes
2. **Scalability**: Easy to add more cards and data
3. **Maintenance**: Centralized data management
4. **Flexibility**: Easy to add new features
5. **Backup**: Database backup and recovery
6. **Multi-user**: Can support multiple users

## Migration Strategy

1. **Phase 1**: Set up database alongside existing JSON
2. **Phase 2**: Update frontend to use API
3. **Phase 3**: Remove JSON file dependency
4. **Phase 4**: Add new features (user accounts, statistics, etc.)

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure Flask-CORS is installed
2. **Image Loading**: Check file paths and permissions
3. **Database Connection**: Verify database credentials
4. **Port Conflicts**: Change port in `api_server.py` if needed

### Debug Commands:

```bash
# Check if database was created
ls -la umamusume_cards.db

# Test database connection
python -c "import sqlite3; conn = sqlite3.connect('umamusume_cards.db'); print('Connected!')"

# Check API response
curl http://localhost:5000/api/cards
```

## Next Steps

After setting up the database:

1. **Add user authentication**
2. **Implement card statistics tracking**
3. **Add card search and filtering**
4. **Create admin panel for data management**
5. **Add card collection tracking**
6. **Implement real-time updates**

## File Structure

```
umamusume-proj/
├── database_setup.py          # Database setup script
├── api_server.py              # Flask API server
├── gacha_database.js          # Updated frontend code
├── requirements.txt           # Python dependencies
├── umamusume_cards.db         # SQLite database (created)
├── support_gacha_rates.json   # Original data (backup)
└── DATABASE_SETUP_README.md   # This file
```

This database approach will make your application more robust and scalable for future development! 
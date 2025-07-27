# Umamusume Gacha Calculator

A web-based gacha rate calculator for Uma Musume Pretty Derby support cards with Express.js backend.

## 🎯 Features

- **Gacha Rate Calculations**: Calculate probability of getting specific cards
- **SSR Card Tracking**: Track SSR cards obtained during rerolls
- **Reroll Counter**: Count and manage reroll attempts
- **Probability Analysis**: Advanced probability calculations
- **Card Image Display**: Visual card representation
- **Database Backend**: SQLite database for data management
- **API Server**: RESTful API for data access

## 📁 Project Structure

```
umamusume-clean/
├── src/                    # Source files
│   ├── gacha.html         # Original version (JSON-based)
│   ├── gacha_database.html # Database version
│   ├── gacha.js           # Original JavaScript
│   ├── gacha_database.js  # Database JavaScript
│   ├── gacha.css          # Styles
│   └── support_gacha_rates.json # Card data
├── assets/                 # Images and assets
│   ├── SSR/               # Card images
│   │   └── Border/        # SVG card borders
│   ├── stats/             # Stat icons
│   │   └── border/        # Type icons
│   └── buttons/           # UI buttons
├── database/              # Database files
│   ├── umamusume_cards.db # SQLite database
│   └── setup.js           # Database setup script
├── test/                  # Testing files
│   └── test.js            # Database testing script
├── docs/                  # Documentation
│   └── DATABASE_SETUP_README.md
├── server.js              # Express.js server
├── package.json           # Node.js dependencies
├── start_express.bat      # Windows startup script
└── setup_express.bat      # Windows setup script
```

## 🚀 Quick Start

### Option 1: Windows (Recommended)
```bash
# Navigate to the project directory
cd umamusume-clean

# Run the setup script (first time only)
.\setup_express.bat

# Run the startup script
.\start_express.bat
```

### Option 2: Manual Setup
```bash
# Navigate to the project directory
cd umamusume-clean

# Install Node.js dependencies
npm install

# Setup database
npm run setup

# Start server
npm start
```

## 🌐 Access Your Application

- **Main Page**: http://localhost:3000
- **Database Version**: http://localhost:3000/database
- **Original Version**: http://localhost:3000/gacha
- **API Endpoint**: http://localhost:3000/api/cards

## 📊 Database Features

### Card Data
- **25 SSR Cards** with rates and types
- **6 Card Types**: Speed, Stamina, Power, Guts, Wits, Friend
- **Image Storage**: All card images stored in database
- **Alphabetical Sorting**: Cards sorted A-Z by name

### API Endpoints
- `GET /api/cards` - Get all cards
- `GET /api/cards/{id}/image` - Get card image
- `GET /api/cards/type/{type}` - Get cards by type
- `GET /api/health` - Health check

## 🎮 How to Use

1. **Select a Card**: Choose from the dropdown menu
2. **Set Parameters**: 
   - Number of copies wanted
   - Desired probability percentage
3. **Calculate**: Click "Calculate" to see results
4. **Track Rerolls**: Use the "+1 Reroll" button to track attempts
5. **Count SSR Cards**: Click on card images to increment counters

## 🔧 Development

### Database Setup
```bash
npm run setup
```

### Testing
```bash
npm test
```

### Development Mode
```bash
npm run dev
```

### Adding New Cards
1. Add card data to `src/support_gacha_rates.json`
2. Add card image to `assets/SSR/Border/`
3. Run database setup to update database

## 📈 Features Comparison

| Feature | Original | Database Version |
|---------|----------|------------------|
| Data Source | JSON file | SQLite database |
| Image Loading | Direct files | File paths |
| Performance | Good | Better (indexed) |
| Scalability | Limited | High |
| Maintenance | Manual | Centralized |

## 🛠️ Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Express.js (Node.js)
- **Database**: SQLite
- **Image Format**: SVG (vector graphics)
- **Server**: Express.js HTTP server
- **CDN**: jsDelivr (optional)

## 🌐 CDN Image Serving

The project supports serving images via jsDelivr CDN for better performance:

### **Enable CDN Mode:**
```bash
.\enable_cdn.bat
```

### **Disable CDN Mode:**
```bash
.\disable_cdn.bat
```

### **CDN URL Format:**
```
https://cdn.jsdelivr.net/gh/username/repo@branch/assets/SSR/Border/card-name.svg
```

### **Benefits:**
- ✅ Faster image loading
- ✅ Reduced server bandwidth
- ✅ Global CDN distribution
- ✅ Automatic caching

## 📝 Card Information

### SSR Cards (25 total)
- **Speed**: 8 cards (Kitasan Black, Gold City, etc.)
- **Stamina**: 5 cards (Satono Diamond, Seiun Sky, etc.)
- **Power**: 4 cards (Smart Falcon, Oguri Cap, etc.)
- **Guts**: 5 cards (Mejiro Palmer, Special Week, etc.)
- **Wits**: 2 cards (Fine Motion, Air Shakur)
- **Friend**: 1 card (Tazuna Hayakawa)

### Rates
- **Standard SSR**: 0.0869% - 0.087%
- **Featured SSR**: 0.5% (Kitasan Black, Satono Diamond)

## 🎨 Image Credits

Card images and icons are from Uma Musume Pretty Derby.

## 📄 License

This project is for educational and personal use only.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Happy Gacha Rolling! 🎰** 
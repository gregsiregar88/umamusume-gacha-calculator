// Configuration for Umamusume Gacha Calculator
const config = {
    // CDN Configuration
    cdn: {
        enabled: true, // Set to true to use jsDelivr CDN
        baseUrl: 'https://cdn.jsdelivr.net/gh/gregsiregar88/umamusume-gacha-calculator@master',
        localBaseUrl: '/assets'
    },
    
    // GitHub Repository Info
    github: {
        username: 'gregsiregar88',
        repo: 'umamusume-gacha-calculator',
        branch: 'master'
    },
    
    // Server Configuration
    server: {
        port: process.env.PORT || 3000
    }
};

// Helper function to get image URL
function getImageUrl(imagePath) {
    if (config.cdn.enabled) {
        // Use CDN URL with fallback to local
        return `${config.cdn.baseUrl}/${imagePath}`;
    } else {
        return `${config.cdn.localBaseUrl}/${imagePath}`;
    }
}

// Helper function to update CDN configuration
function updateCdnConfig(username, repo, branch = 'main') {
    config.cdn.baseUrl = `https://cdn.jsdelivr.net/gh/${username}/${repo}@${branch}`;
    config.github.username = username;
    config.github.repo = repo;
    config.github.branch = branch;
}

module.exports = { config, getImageUrl, updateCdnConfig }; 
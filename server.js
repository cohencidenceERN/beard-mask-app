const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

const API_KEY = process.env.REPLICATE_API_KEY || 'r8_QlG0s40lNmO5XRmSm2JkDvTomggsZDs43Q674';

// Proxy: Create prediction
app.post('/api/predict', async (req, res) => {
    try {
        const { input } = req.body;
        const response = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                version: 'e490d072a34a94a11e9711ed5a6ba621c3fab884eda1665d9d3a282d65a21180',
                input
            })
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Proxy: Poll prediction
app.get('/api/predict/:id', async (req, res) => {
    try {
        const response = await fetch(`https://api.replicate.com/v1/predictions/${req.params.id}`, {
            headers: { 'Authorization': `Token ${API_KEY}` }
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Beard Mask server running on port ${PORT}`));

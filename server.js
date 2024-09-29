const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // To parse request body


app.get('/', (req, res) => {
    res.send('Welcome');
});

// MongoDB connection string (replace <your_mongo_url>)
mongoose.connect(process.env.MONGODB_URI)
// MongoDB schema and model for offer
const offerSchema = new mongoose.Schema({
    offerId: Number,
    title: String,
    imageUrl: String
});

const Offer = mongoose.model('Offer', offerSchema);

// Fetch the current offer
app.get('/offer', async (req, res) => {
    try {
        const offer = await Offer.findOne(); // Fetch the latest offer
        res.json(offer);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching offer' });
    }
});

// Update the offer
app.post('/update-offer', async (req, res) => {
    const { offerId, title, imageUrl } = req.body;
    try {
        let offer = await Offer.findOne();
        if (offer) {
            offer.offerId = offerId;
            offer.title = title;
            offer.imageUrl = imageUrl;
        } else {
            offer = new Offer({ offerId, title, imageUrl });
        }
        await offer.save(); // Save offer to the database
        res.json({ message: "Offer updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: 'Error updating offer' });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



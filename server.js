const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/g7reenGuidance', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define Student Schema
const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    exam: String,
    message: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Student = mongoose.model('Student', studentSchema);

// API Routes
app.post('/api/submit-form', async (req, res) => {
    try {
        const { name, email, phone, exam, message } = req.body;
        
        // Create new student document
        const student = new Student({
            name,
            email,
            phone,
            exam,
            message
        });

        // Save to database
        await student.save();

        res.status(200).json({
            success: true,
            message: 'Form submitted successfully!'
        });
    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting form. Please try again.'
        });
    }
});

// Get all submissions (for admin purposes)
app.get('/api/submissions', async (req, res) => {
    try {
        const submissions = await Student.find().sort({ createdAt: -1 });
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching submissions'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 
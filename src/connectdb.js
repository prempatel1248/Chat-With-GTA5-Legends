require('dotenv').config();

const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const User = require('./userModel');
const nodemailer = require("nodemailer");


const app = express();
app.use(express.json());
app.use(cors());

const mongoURI = process.env.REACT_APP_MONGODB;
console.log("MongoUrl: ", process.env.REACT_APP_MONGODB);

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));


async function insert(userEmail, userPassword) {
    try {
        // const hashedPassword = await bcrypt.hash(userPassword, 10);
        await User.create({
            email: userEmail,
            password: userPassword
        });
        
    } catch (err) {
        console.error('Error inserting user:', err);
    }
}

app.post('/signup', async (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password
    };

    try {
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email." });
        }

        await insert(data.email, data.password);
        res.status(201).send("Signup successful"); // Send a success response
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).send("An error occurred during signup.");
    }
});

app.post('/otp', async (req, res) => {
    const data = {
        email: req.body.email,
        otp: req.body.otp
    };

    try{
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            console.log("existing user");
            return res.status(400).json({ message: "User already exists with this email." });
        }
        
        const auth = nodemailer.createTransport({
            service: "gmail",
            secure : true,
            port : 465,
            auth: {
                user: "prempatel01248@gmail.com",
                pass: process.env.REACT_APP_GMIAL_PASS
    
            }
        });
    
        let receiver = {
            from : "prempatel01248@gmail.com",
            to : data.email,
            subject : "Chat With GTA-5 Legends OTP",
            text : `Your signup OTP is ${data.otp}`
        };
    
        auth.sendMail(receiver, (error, emailResponse) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
        });
        
    }
    catch(error){
        console.log("Error during sending otp: ", error);
        res.status(500).send("An error occurred during sending otp.");
    }
})

app.post('/login', async (req, res) => {

    const data = {
        email: req.body.email,
        password: req.body.password
    };

    try {
        // Check if user already exists
        const user = await User.findOne({ email: data.email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }

        if(data.password !== user.password){
            return res.status(400).json({ message: "Invalid email or password" });
        }
        res.status(201).send("Login successful"); // Send a success response
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).send("An error occurred during signup.");
    }
})



app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
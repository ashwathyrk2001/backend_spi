const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const port = 5000;
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const DeliveryStatus = require('./models/DeliveryStatusModel');
const Users = require('./models/UserModel')
const Payment = require('./models/PaymentModel')

const product = require("./controllers/product")
const productview = require("./controllers/productview")
const moredetails = require("./controllers/moredetails")
const order = require("./controllers/order")
const addtocart = require("./controllers/addtocart")
const shopreg = require("./controllers/shopreg")
const table = require("./controllers/table")
const dailyslot = require("./controllers/dailyslot")
const bookslot = require("./controllers/bookslot")
const dealerreg = require("./controllers/dealerreg")
const price = require("./controllers/price")
const license = require("./controllers/license")
const selling = require("./controllers/selling")
const delivery = require("./controllers/delivery")
const edit = require("./controllers/edit")




app.use(cors());
app.use(express.json());

app.use("/api/productview",productview)
app.use("/api/products",product)
app.use("/api/moredetails",moredetails)
app.use("/api/order",order)
app.use("/api/orders",order)
app.use("/api/ordering",order)
app.use("/api/productstock",order)
app.use("/get-product-image/:filename",productview)
app.use("/api/add-to-cart",addtocart)
app.use("/api/clear-cart",addtocart)
app.use("/api/cart",addtocart)
app.use("/api/remove",addtocart)
app.use("/api/current",order)
app.use("/api/shop",table)
app.use("/api/shopreg",shopreg)
app.use("/api/ordertable",table)
app.use("/api/users",table)
app.use("/api/update-price",price)
app.use("/api/get-price",price)
app.use("/api/user",price)
app.use("/api/user",table)
app.use("/api/edit",edit)
app.use("/api/dealertable",table)
app.use("/api/ordertable",table)
app.use("/api/bookingdetails",table)
app.use("/api/shopview",shopreg)
app.use("/api/approve",shopreg)
app.use("/api/shopviewbyid",shopreg)
// app.use("/api/create-order",payment)
// app.use("/api/verify-payment",payment)
app.use("/api/shoplocation",shopreg)
app.use("/api/dailyslot",dailyslot)
app.use("/api/getdailyslot",dailyslot)
app.use("/api/bookslot",bookslot)
app.use("/api/bookingsold",bookslot) 
app.use("/api/dealerreg",dealerreg)
app.use("/api/dealerview",dealerreg)
app.use("/api/approvedealer",dealerreg)
app.use("/api/selling",selling)
app.use("/api/licenserequest",license)
app.use("/api/getlicense",license)
app.use("/api/generatelicense",license)
app.use("/api/delivery",delivery)


mongoose.connect('mongodb+srv://Philip:philip@cluster0.g9drxmg.mongodb.net/Aromawagon?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });



  app.use(bodyParser.json());

  const razorpay = new Razorpay({
    key_id: 'rzp_test_QCVPmuBwOiEzBI',      // Replace with your Razorpay Key ID
    key_secret: 'JFZYLJBq9hPDYf3TRVBDKaA1',  // Replace with your Razorpay Key Secret
  });
  
  // Your existing server logic...
  
  // Razorpay integration for creating an order
  let orderIdCounter = 1; // Initialize a simple order ID counter

  app.post('/api/razorpay', async (req, res) => {
    console.log('Received create order request:', req.body);
    const { amount, currency } = req.body;
    console.log(amount);  
    try {
      const orderOptions = {
        amount: amount * 100,
        currency,
        receipt: `order_${orderIdCounter}`,
      };
  
      const order = await razorpay.orders.create(orderOptions);
      orderIdCounter += 1;
  
      res.json({ order_Id: order.id });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  });
  


  app.post('/api/save-payment', async (req, res) => {
    try {
      // Extract payment details from the request body
      const { userId, orderId, amount, currency, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  
      // Create a new payment document
      const payment = new Payment({
        user: userId, // Assuming 'user' is a reference to the User model
        amount: amount,
        currency: currency,

        status: 'success', // Assuming the payment was successful
      });
  
      // Save the payment to the database
      await payment.save();
  
      // Send a success response
      res.status(201).json({ message: 'Payment details saved successfully', payment: payment });
    } catch (error) {
      console.error('Error saving payment:', error);
      // Send an error response
      res.status(500).json({ message: 'Failed to save payment details', error: error.message });
    }
  });
  
  app.get('/users/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Fetch user data from the database based on userId
      const user = await Users.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Respond with the user data
      res.json(user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

// Registration for Customer
app.post('/register', async (req, res) => {
  const { name, username, email, password, confirmPassword, address } = req.body;

  try {
    // Create a new user instance with the provided data
    const newUser = new Users({ 
      name, 
      username, 
      email, 
      password, 
      confirmPassword, 
      address, 
      role: 'customer' 
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success message
    res.status(201).json({ msg: 'Dealer registered successfully' });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ msg: 'Failed to register dealer' });
  }
});


// Registration for Dealer
app.post('/register1', async (req, res) => {
  const { name, username, email, password, confirmPassword, address } = req.body;

  try {
    // Create a new user instance with the provided data
    const newUser = new Users({ 
      name, 
      username, 
      email, 
      password, 
      confirmPassword, 
      address, 
      role: 'dealer' 
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success message
    res.status(201).json({ msg: 'Dealer registered successfully' });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ msg: 'Failed to register dealer' });
  }
});

// Registration for Landowner
app.post('/register2', async (req, res) => {
  const { name, username, email, password, confirmPassword, address } = req.body;

  try {
    // Create a new user instance with the provided data
    const newUser = new Users({ 
      name, 
      username, 
      email, 
      password, 
      confirmPassword, 
      address, 
      role: 'landowner' 
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success message
    res.status(201).json({ msg: 'Dealer registered successfully' });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ msg: 'Failed to register dealer' });
  }
});



app.post('/register3', async (req, res) => {
  const { name, username, email, password, confirmPassword, address } = req.body;

  try {
    // Create a new user instance with the provided data
    const newUser = new Users({ 
      name, 
      username, 
      email, 
      password, 
      confirmPassword, 
      address, 
      role: 'parcher' 
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success message
    res.status(201).json({ msg: 'Dealer registered successfully' });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ msg: 'Failed to register dealer' });
  }
});



app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user with provided credentials exists
    const user = await Users.findOne({ username });
    if (user) {
      res.status(200).json({ msg: 'Login Successful' ,user : { user} });
    } else {
      res.status(401).json({ msg: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'An error occurred during login' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



////
const nodemailer = require('nodemailer');

const emailUser ="ashwathyrk08@gmail.com";
const emailPassword ="sjnq xrwa abho qsej";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

let storedOtps = {}; // Store OTPs for different users

app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  console.log(email)
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store the OTP in the user's record (in a production app, you'd use a database)
  try {
    const user = await Users.findOne({ email });
    
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User not found!!!",
      });
    }

    // Store the OTP for this user
    storedOtps[email] = otp;

    // Send the OTP via email
    const mailOptions = {
      from: emailUser,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP for password reset: ${otp},`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      console.log("OTP email sent:", info.response);
      res.status(200).json({ 
        success: true,
        message: "OTP sent successfully." });
    });
  } catch (error) {
    console.error("Error saving OTP:", error);
    return res.status(500).json({ 
      error: "Internal Server Error" });
  }
});

// Verify OTP and reset password
app.post('/api/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  console.log(email, otp, newPassword);
  
  try {
    const user = await Users.findOne({ email });
    
    console.log(user);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found!!!",
      });
    }

    // Check if the provided OTP matches the stored OTP for this user
    if (storedOtps[email] !== otp) {
      console.log(otp);
      console.log(storedOtps[email]);
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Update the user's password and clear the OTP
    const login = await Users.findOne({ email });
    console.log(newPassword);
    const saltRounds = 10;
    const password = newPassword;
    console.log(password);
    delete storedOtps[email]; // Clear the OTP for this user
    await login.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


const axios = require('axios');

const cheerio = require('cheerio'); // Import cheerio library


app.get('/prices', async (req, res) => {
  try {
      const response = await axios.get('https://www.indianspices.com/marketing/price/domestic/daily-price.html');
      const html = response.data;

      const $ = cheerio.load(html);

      const cardamomPrices = [];
$('table tr').each((index, element) => {
    const columns = $(element).find('td');
    if (columns.length === 8) { // Fix the condition to check for 8 cells
        const price = {
            date: $(columns[1]).text(),
            auctioneer: $(columns[2]).text(),
            lots: parseInt($(columns[3]).text()),
            totalQty: parseFloat($(columns[4]).text()),
            qtySold: parseFloat($(columns[5]).text()),
            maxPrice: parseFloat($(columns[6]).text().replace(/,/g, '')), // Remove commas before parsing
            avgPrice: parseFloat($(columns[7]).text().replace(/,/g, '')) // Remove commas before parsing
        };
        cardamomPrices.push(price);
    }
});
      console.log("Backend cardamom prices:", cardamomPrices); // Log the cardamom prices
      res.json(cardamomPrices);
  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Error fetching data');
  }
});

const twilio = require('twilio');
const { appendXML } = require('pdfkit');
const otpSchema = new mongoose.Schema({
  otp: String,
  createdAt: { type: Date, default: Date.now },
});
const OTP = mongoose.model('OTP', otpSchema);

// Twilio credentials
const accountSid = 'ACcf936afdc3e3b91c735ed97337dd2886';
const authToken = '513948729cc4d27382e660e25a3aead5';
const twilioPhoneNumber = '+13343674103';

const client = twilio(accountSid, authToken);

// Middleware
app.use(bodyParser.json());

// Generate and send OTP endpoint
app.post('/generate-otp', async (req, res) => {
  try {
    // Extract phone number from request body
    const { phoneNumber } = req.body;

    // Generate a random OTP (6-digit code)
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Send OTP via SMS using Twilio
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: twilioPhoneNumber,
      to: '+918590864860'
    });

    // Save OTP to database
    await OTP.create({ otp });

    // Respond with success message
    res.json({ success: true, otp });
  } catch (error) {
    console.error('Error generating and sending OTP:', error);
    // Respond with error message
    res.status(500).json({ success: false, error: 'Failed to generate and send OTP' });
  }
});

// Verify OTP endpoint
// Verify OTP endpoint
app.post('/verify-otp', async (req, res) => {
  const { otp, orderId } = req.body;
  try {
    // Find the OTP in the database
    const foundOTP = await OTP.findOne({ otp });
    if (foundOTP) {
      // Delete the OTP from the database to prevent reuse
      await OTP.deleteOne({ otp });
      // Update delivery status to "Delivered" for the order
      await DeliveryStatus.updateOne({ orderId }, { delivered: true });
      res.json({ success: true, message: 'OTP verified successfully' });
    } else {
      res.json({ success: false, message: 'OTP verification failed' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

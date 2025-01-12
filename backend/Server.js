const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const axios = require('axios');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3001;

const AK = "oRjVWSGZbehcnxpXsa3LLOCs";
const SK = "3mGzUCGW8vONPxMXmqoaumVFHna0EfdS";

app.use(cors({
  origin: 'https://online-shop-front-end-eta.vercel.app', // Replace with your frontend's URL
  credentials: true // If you need to send cookies or HTTP authentication
}));
app.use(express.json());
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

//mongoose.connect('mongodb+srv://eric:fsa93LW7I2SENuEg@cluster0.vmzqx7w.mongodb.net/db?retryWrites=true&w=majority&appName=Cluster0')
mongoose.connect('mongodb+srv://soube1:009009@cluster0.btd76.mongodb.net/db?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).send('User created successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (user && await bcrypt.compare(password, user.password)) {
        res.cookie('userEmail', email, { httpOnly: true, sameSite: 'strict' });
        res.send('Login successful');
      } else {
        res.status(400).send('Invalid email or password');
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

app.post('/products', upload.single('image'), async (req, res) => {
    try {
      const { name, price, type, description } = req.body;
      const image = req.file.filename;
  
      const product = new Product({ name, price, image, type, description });
      await product.save();
      res.status(201).send('Product created successfully');
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

app.get('/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

app.get('/products/discount', async (req, res) => {
    try {
        const discountProducts = await Product.find({ type: 'discount' });
        res.json(discountProducts);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


async function getAccessToken() {
  const response = await axios.post(`https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${AK}&client_secret=${SK}`);
  return response.data.access_token;
}

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const accessToken = await getAccessToken();
    console.log('Access Token:', accessToken);

    const response = await axios.post(`https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-tiny-8k?access_token=${accessToken}`, {
      messages: [{
        role: "user",
        content: `You are the AI customer service representative for Imagineering, a shop that sells beauty-related products.You are currently discussing with a client and should keep your reply short and precise and respond in English. Here is the client's message: "${message}"`
      }]
    }, { headers: { 'Content-Type': 'application/json' }});

    console.log('API Response:', response.data);

    const result = response.data.result;
    res.json({ result });
  } catch (error) {
    console.error('Error communicating with AI model:', error.response ? error.response.data : error.message);
    res.status(500).send('Internal Server Error');
  }
});
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'soube009@gmail.com',
    pass: 'hsyzpzbffbvaagsj'
  }
});


app.post('/purchase', async (req, res) => {
  const { userEmail, userName, productName, productPrice, address, phoneNumber } = req.body;
  const mailOptions = {
    from: 'soube009@gmail.com',
    to: userEmail,
    subject: 'Thank You for Your Order!',
    text: `Dear ${userName},\n\nThank you for purchasing ${productName}. The total price is $${productPrice}.\n\nBest regards,\nImagineering`
  };

  await transporter.sendMail(mailOptions);

  const order = new Order({
    userName: userName,
    orderID: new mongoose.Types.ObjectId(),
    item: productName,
    price: productPrice,
    address: address,
    phoneNumber: phoneNumber
  });
  await order.save();

  res.status(201).json({ message: 'Purchase successful, receipt emailed.', redirect: true });

});



app.listen(PORT,  () => {
  console.log(`Server is running on port ${PORT}`);
});
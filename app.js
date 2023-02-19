require('dotenv').config();
require('./config/database').connect();

const express = require('express');
const User = require('./model/user');
const Tran = require('./model/transaction');
const jwt = require('jsonwebtoken');
const path = require('path');
const auth = require('./middleware/auth');
const homeRoute = require("./routes/home");
const tranferRoute = require("./routes/tranfer");
const cookieParser = require('cookie-parser');
const sendCookie = require('./middleware/sendCookie');
const bcrypt = require('bcryptjs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended:false  
}));
app.use(cookieParser());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
})


//root page
app.get('/', (req, res, next) =>{
    res.render('login');
})

//register
app.post("/register", async (req, res) =>{
    try{
        //get user
        const { f_name, l_name, email, password ,account} = req.body;

        //Validate ip
        if(!(email && password && f_name && l_name && account)){
            res.status(400).send("All input required");
        }
        //check user มีอยู่แล้ว
        const oldUser = await User.findOne({email});
        
        if(oldUser){
            return res.status(409).send("User already exist");
        }

        encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            f_name,
            l_name,
            email: email.toLowerCase(),
            password: encryptedPassword,
            account
        })

        const token = jwt.sign(
            { user_id: user._id, email},
            process.env.TOKEN_KEY,
            {
                expiresIn:"2h"
            }
        )

        //save user token
        user.token = token;
        //return new user
        res.status(201).json(user);

    }catch(err){
        console.log(err);
    }
})

//login

app.post("/login", async (req, res) => {
    try{
        //get user ip
        
        const email = req.body.user_email;
        const password = req.body.user_password;
        

        //validate user ip
        if(!(email && password)){
            res.status(400).send("All input is required")
        }

        //validate ถ้ามีอยู่แล้ว
        const user = await User.findOne({ email });
        
        if(user && (await bcrypt.compare(password,user.password))){
            const token = jwt.sign({ user_id: user._id, email},process.env.TOKEN_KEY,{expiresIn: "2h"})
            user.token = token;

            console.log(user);

            res.status(200).cookie('token', token).render('home', {data:user,success:''})
        }

        res.status(400).send("Invalid Credential")

    }catch(err){
        console.log(err);
    }
})
app.get("/home" ,auth, async(req, res) =>{
    res.render('home')
})

app.get("/tranfer" ,auth, async(req, res) =>{
    res.render('tranfer')
})

app.post("/tranfer",auth, async(req, res) => {

    const src_account = req.body.src_account;
    const account = req.body.tran_account;
    const amount = req.body.tran_amount;

    const user = await User.findOne({ account:account });
    const src = await User.findOne({ account:src_account });
    console.log(src_account);
    console.log(account);

    if(src.balance > 0){
    const src_result = parseInt(src.balance)-parseInt(amount);
    const result = parseInt(user.balance)+parseInt(amount);

    const src_update = { $set: {balance: src_result}};
    const update = { $set: {balance: result}};

    await User.updateOne({ account : src.account }, src_update)
    await User.updateOne({ account : user.account }, update)

    //ทำใบเสร็จ
    await Tran.create({
        source:src.account,
        dest:user.account,
        action:"Tranfer",
        time:Date.now(),
        amount: amount
    })

    res.render('home', {data : src, success:''})   
    }else{
        res.render('home', {data : src,success : "ยอดเงินในบัญชีของคุณไม่เพียงพอ"})
    }
    
    
})

app.get("/deposit",auth, async(req, res) => {
    res.render('deposit');  
})

app.post("/deposit",auth, async(req, res) => {
  
    const src_account = req.body.src_account;
    const amount = req.body.tran_amount;

    const src = await User.findOne({ account:src_account });

    const src_result = parseInt(src.balance)+parseInt(amount);

    const src_update = { $set: {balance: src_result}};

    await User.updateOne({ account : src.account }, src_update)
    await Tran.create({
        source:src.account,
        dest:src.account,
        action:"Deposit",
        time:Date.now(),
        amount: amount
    })

    res.render('home', {data : src, success:''})   
    
})

app.get("/withdraw",auth, async(req, res) => {
    res.render('withdraw');  
})

app.post("/withdraw",auth, async(req, res) => {
  
    const src_account = req.body.src_account;
    const amount = req.body.tran_amount;

    const src = await User.findOne({ account:src_account });

    const src_result = parseInt(src.balance)-parseInt(amount);

    const src_update = { $set: {balance: src_result}};

    await User.updateOne({ account : src.account }, src_update)
    await Tran.create({
        source:src.account,
        dest:src.account,
        action:"Withdraw",
        time:Date.now(),
        amount: amount
    })

    res.render('home', {data : src, success:''})   
    
})

app.get("/history",auth, async(req, res) => {
    const all = await Tran.find()
    res.json(all);
    console.log(all);
})

app.post("/history",auth, async(req, res) => {
  
    Tran.find()
    console.log
    res.render('home', {data : src, success:''})   
    
})

module.exports = app;
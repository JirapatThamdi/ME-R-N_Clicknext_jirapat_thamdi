
const express = require('express')
const path = require('path');
const auth = require('../middleware/auth');
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get("/", async (req,res) =>{  
    res.send("ok");
});

router.post("/tranfer", async (req,res) =>{
    
    res.send("ok");
});



module.exports = router;
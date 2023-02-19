const express = require('express')
const path = require('path');
const auth = require('../middleware/auth');
const User = require('../model/user');
const router = express.Router();


router.post('/transaction',auth, async(req, res) =>{
    try{
        const{ action, amount, dest, source, time} = req.body;

        if(!(action && amount && dest )){
            res.status(400).send("Please input!");
        }

        const tran = await Transaction.create({
            action,
            amount,
            dest,
            source,
            time
        })

        const user = await User.findOne({ email });
        //ตรวจสอบยอดในบัญชี
        if(user.balance < amount){
            res.status(400).send("เงืนในบัญชีไม่พอ");
        }

    }catch(err){
        console.log(err);
    }
})

module.exports = router;
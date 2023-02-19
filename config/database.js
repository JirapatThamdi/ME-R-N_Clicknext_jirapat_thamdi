const mongoose = require('mongoose');

const { MONGO_URI } = process.env;

exports.connect = () => {
    //เชื่อมdatabase

    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() =>{
        console.log("Successfully connected to database");
    })
    .catch((error) => {
        console.log("Error connecting to database!");
        console.error(error);
        process.exit(1);
    });
}
require ('./config/config');

const express  =  require('express');
const mongoose = require('mongoose'); 
// require('dotenv').config();
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use( require('./routes/index'));

mongoose.connect( process.env.URLDB, 
                    { useNewUrlParser: true, useCreateIndex: true,  useUnifiedTopology: true}, 
                    (err,res) => {
        if ( err ) throw err;
        console.log('Db is online!');
});

app.listen(process.env.PORT, () => {
    console.log(`Listen port ${ process.env.PORT }` )
});
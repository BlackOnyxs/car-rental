require ('./config/config');

const express =  require('express');


const app = express();

app.listen(process.env.PORT, () => {
    console.log(`Listen port ${process.env.PORT }` )
});
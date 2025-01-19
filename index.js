
const express = require('express');
const app = express();
const PORT = 3000;
const {authenticateToken} = require('./middleware/auth'); 

app.use(express.json());
app.use(authenticateToken);

app.get('/',(req,res) => {
    console.log('Hello World');
    res.json(`Hello World ${req.user}`);
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
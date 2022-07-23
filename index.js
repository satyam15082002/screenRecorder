const express=require('express')
const app=express()
app.use(express.static('./'))
app.get("/",(req,res)=>{
    res.sendFile('index.html');
})
app.listen(process.env.PORT||1000);
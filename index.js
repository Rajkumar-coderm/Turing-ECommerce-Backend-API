const express=require('express');
const app=express();
app.use(express.json())
const jwt=require('./auth/jwt')

app.use('/',require('./Routs/departments'))
app.use('/',require("./Routs/categories"))
app.use('/',require('./Routs/attributes'))
app.use('/',require('./Routs/products'))
app.use('/',require('./Routs/tax'))
app.use('/',require('./Routs/shipping'))
app.use('/',require('./Routs/customers'))
app.use('/',require('./Routs/shoppingcart'))
app.use('/',require('./Routs/orders'))

app.listen(2021,()=>{
    console.log('server start......');
})

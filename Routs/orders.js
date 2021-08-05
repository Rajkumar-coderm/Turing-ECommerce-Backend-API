const express=require('express');
const knex=require('../database/db')
const routs=express()
routs.use(express.json());
const {authenticateToken}=require('../auth/jwt')

// create a order and post a data
routs.post('/orders',authenticateToken,(req,res)=>{
    knex.select('*').from('shopping_cart').where('cart_id', req.body.cart_id).join('product', function () {
        this.on('shopping_cart.product_id', 'product.product_id')
    }).then((data) => {
        knex('orders').insert({
            'total_amount': data[0].quantity * data[0].price,
            'created_on': new Date(),
            "customer_id": req.data.customer_id,
            "shipping_id": req.body.shipping_id,
            "tax_id": req.body.tax_id
        }).then((data2) => {
            knex("order_detail").insert({
                "unit_cost": data[0].price,
                "quantity": data[0].quantity,
                "product_name": data[0].name,
                "attributes": data[0].attributes,
                "product_id": data[0].product_id,
                "order_id": data2[0]
            }).then((data3) => {
                knex.select('*').from('shopping_cart').where('cart_id', req.body.cart_id).del()
                    .then((data4) => {
                        res.send({
                            order_status: 'ordered seccesfully',
                            order_id: data2[0]
                        })
                    }).catch((err) => {
                        res.send({ err: err.message })
                    })
            }).catch((err) => {
                res.send({ err: err.message })
            })
        }).catch((err) => {
            res.send({ err: err.message })
        })
    }).catch((err) => {
        res.send({ err: err.message })
    })
})

// get data in order by id...
routs.get('/orders/:order_id',(req,res)=>{
    let order_id=req.params.order_id;
    knex.select('orders.order_id',
    'product.product_id',
    'order_detail.attributes',
    'product.name as product_name',
    'order_detail.quantity',
    'product.price',
    'order_detail.unit_cost').from('orders').join('order_detail',function(){
        this.on('orders.order_id','order_detail.order_id')
    }).join('product',function(){
        this.on('order_detail.product_id','product.product_id')
    }).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })
})


// get order incustomers by token get data.
routs.get('/orders/incustomer',authenticateToken,(req,res)=>{
    let customer_id=req.data.customer_id;
    knex.select('*').from('customer').where('customer_id',customer_id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })
})

// get order short detatils.
routs.get('/orders/shortdetail/:order_id',(req,res)=>{
    const order_id=req.params.order_id;
    knex.select('order_id','total_amount',"created_on","shipped_on","status",'product.name').from('orders').join('product',function(){
        this.on('orders.order_id','product.product_id')
    }).where('orders.order_id',order_id).then((data)=>{
        res.send(data)
    })

})

module.exports=routs;
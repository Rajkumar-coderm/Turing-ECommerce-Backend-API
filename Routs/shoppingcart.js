const express=require('express');
const knex=require('../database/db');
const routs=express();
routs.use(express.json())

// generateuniqueid in rendom in text....
routs.get('/shoppingcart/generateuniqueid',(req,res)=>{
    let cart_id1 = "";
    let char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
    for(var i=0; i<11; i++){
        cart_id1 += char.charAt(Math.floor(Math.random() * char.length))
    }
    var cart_id = {
        "cart_id": cart_id1
    }
    console.log(cart_id);
    res.send(cart_id);
});


// post new data in shoppingcart...
routs.post('/shoppingcart/add',(req,res)=>{
    knex.select('*').from('product').then((data)=>{
        let product_id=data[0].product_id
        let user={
            cart_id:req.body.cart_id,
            product_id:product_id,
            attributes:req.body.attributes,
            quantity:req.body.quantity,
            buy_now:req.body.buy_now,
            added_on:new Date()
        }
        knex('shopping_cart').insert(user).then((data)=>{
            knex.select('item_id','name','attributes','shopping_cart.product_id','price','quantity','image').from('shopping_cart')
            .join('product',function(){
                this.on('shopping_cart.product_id','product.product_id')
            }).then(data => {
                let data1 = []
                for (let i of data){
                    let total = i.price*i.quantity;
                    i.total = total;
                    data1.push(i);
                }
                res.send(data);
            }).catch(err => console.log(err));
        }).catch((err)=>{
            res.send(err)
        })

    })
});


// getting shopping cart datt using genrate cart_id....
routs.get('/shoppingcart/:cart_id',(req,res)=>{
    let cart_id = req.params.cart_id;
    knex
    .select(
        'item_id',
        'name',
        'attributes',
        'shopping_cart.product_id',
        'price',
        'quantity',
        'image'
    )
    .from('shopping_cart')
    .join('product', function(){
        this.on('shopping_cart.product_id', 'product.product_id')
    })
    .where('shopping_cart.cart_id', cart_id)
    .then((data) =>{
        let result = []
        for (var i of data){
            let subtotal = i.price*i.quantity;
            i.subtotal = subtotal;
            result.push(i);
        }
        console.log(result);
        res.send(result);
    }).catch(err=> console.log(err));
})


// update shippingcart data using items id..
routs.put('/shippingcart/update/:item_id',(req,res)=>{
    const item_id=req.params.item_id;
    knex('shopping_cart').where('item_id',item_id).update({
        quantity:req.body.quantity
    }).then((data)=>{
        knex.select('item_id',
        'product.name',
        'shopping_cart.attributes',
        'shopping_cart.product_id',
        'product.price',
        'shopping_cart.quantity',
        'product.image').from('shopping_cart').join('product', function () {
            this.on('shopping_cart.product_id', 'product.product_id')
        }).where('item_id',item_id).then((data)=>{
            res.send(data)
        })
    })
})

// delete shoppingcart in using cart_id delete all data
routs.delete('/shoppingcart/empty/:cart_id',(req,res)=>{
    const cart_id=req.params.cart_id;
    knex('shopping_cart').where('cart_id',cart_id).del().then((data)=>{
        res.send({message:"delete seccesfully....."})
    }).catch((err)=>{
        res.send(err)
    })
})

// shopping cart movetocart.
routs.get('/shoppingcart/movetocart/:item_id',(req,res)=>{
    knex.select('*').from('later').where('item_id',req.params.item_id).then((data)=>{
        knex('cart').insert(data[0]).then((data1)=>{
            res.send({message:"seccesfully move to cart"})
        }).catch((err)=>{
            res.send(err)
        })
    }).catch((err)=>{
        res.send(err)
    })
})

// get total amound in shopping cart...
routs.get('/shoppingcart/totalamout/:cart_id',(req,res)=>{
    knex.select('price','quantity').from('shopping_cart').join('product',function(){
        this.on('shopping_cart.product_id','product.product_id')
    }).where('shopping_cart.cart_id',req.params.cart_id).then((data)=>{
        let obj={}
        let t=data[0].price*data[0].quantity;
        obj.totalAmount=t
        res.send(obj)
    }).catch((err)=>{
        console.log(err)
        res.send(err)
    })
})

// save a product for later in using shippin_cart table datat.
routs.get('/shoppingcart/saveforlater/:item_id',(req,res)=>{
    let item_id=req.params.item_id;
    knex.select('*').from('shopping_cart').where('item_id',item_id).then((data)=>{
        // res.send(data)
        knex('later').insert(data[0]).then((result)=>{
            res.send({message:"seccesfully save data"})
        }).catch((err)=>{
            res.send(err)
        })
    }).catch((err)=>{
        res.send(err)
    })
})

// get product ssave for laler...
routs.get('/shoppingcart/getsaved/:cart_id',(req,res)=>{
    knex.select('item_id','product.name','attributes','product.price').from('shopping_cart').join('product',function(){
        this.on('shopping_cart.product_id','product.product_id')
    }).then((data)=>{
        res.send(data)
    })
})

// Remove a product in the cart...
routs.delete('/shoppingcart/removeproduct/:item_id',(req,res)=>{
    knex.select('*').from('shopping_cart').where('item_id',req.params.item_id).del().then((data)=>{
        res.send({message:"seccesfully delete data in shopping cart.."})
    }).catch((err)=>{
        res.send(err)
    })
})


module.exports=routs;

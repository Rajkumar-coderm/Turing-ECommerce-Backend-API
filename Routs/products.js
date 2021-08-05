const express = require('express');
const knex = require('../database/db')
const routs = express()
routs.use(express.json())

// get all product....
routs.get('/products', (req, res) => {
    knex.select('*').from('product').then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send(err)
    })
})

// search product using search query... 
routs.get('/product/search', (req, res) => {
    const search = req.query.search;
    knex.select('product_id', 'name', 'description', 'price', 'discounted_price',
        'thumbnail').from('product').where('name', 'like', '%' + search + '%')
        .orWhere('description', 'like', '%' + search + '%').orWhere('product_id', 'like', '%' + search + '%').orWhere('price', 'like', '%' + search + '%').then((data) => {
            res.send(data)
        }).catch((err) => {
            res.send(err)
        })
})

// get product by id...
routs.get('/products/:product_id', (req, res) => {
    const product_id = req.params.product_id;
    knex.select('*').from('product').where('product_id', product_id).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.send(err);
    });
});


// get a lit of Products  of categories.... 
routs.get('/products/incategory/:category_id',(req,res)=>{
    const category_id=req.params.category_id;
    knex.select('product.product_id','name','description','price','discounted_price','thumbnail').from('product').join('product_category',function(){
        this.on('product.product_id','product_category.product_id')
    }).where('product.product_id',category_id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })
})


// get a list of product on department....
routs.get('/products/indepartment/:department_id',(req,res)=>{
    const department_id =req.params.department_id;
    knex.select('product.product_id','product.name','product.description','product.price','product.discounted_price','product.thumbnail'
    ).from('product').join('product_category', function(){
        this.on('product.product_id', 'product_category.product_id')
    }).join('category', function(){
        this.on('product_category.category_id', 'category.category_id')
    }).join('department', function(){
        this.on('category.department_id', 'department.department_id')
    }).where('department.department_id', department_id)
    .then((data) =>{
        res.send(data);
    }).catch((err) =>{
        console.log(err);
    })
})

// get details of product...
routs.get('/products/:product_id/details',(req,res)=>{
    const product_id=req.params.product_id;
    knex.select('product_id','name','description','price','discounted_price','image','image_2').from('product').where('product_id',product_id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })
});

// get location of product...
routs.get('/products/:product_id/location',(req,res)=>{
    let product_id = req.params.product_id;
    knex.select('category.category_id','category.name as category_name','category.department_id','department.name as department_name').from('product')
    .join('product_category', function(){
        this.on('product.product_id', 'product_category.product_id')
    })
    .join('category', function(){
        this.on('product_category.category_id', 'category.category_id')
    })
    .join('department', function(){
        this.on('category.department_id', 'department.department_id')
    }).where('product.product_id', product_id).then((data) =>{
        res.send(data);
    }).catch((err) =>{
        console.log(err);
    })
});


// get review in product..
routs.get('/products/:product_id/reviews',(req,res)=>{
    const product_id=req.params.product_id;
    knex.select('*').from('review').where('product_id',product_id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })
});

// post review...
const {authenticateToken}=require('../auth/jwt')
routs.post('/products/:product_id/review',authenticateToken,(req,res)=>{
    const product_id=req.params.product_id;
    knex.select("*").from('customer').where('customer_id',req.data.customer_id).then((data)=>{
        knex('review').insert({
            review: req.body.review,
            rating: req.body.rating,
            product_id: product_id,
            created_on: new Date,
            customer_id: data[0].customer_id
        }).then((data)=>{
            res.send({message:"thanks for give review.."})
        }).catch((err)=>{
            res.send(err)
        })
    })
})


module.exports = routs;
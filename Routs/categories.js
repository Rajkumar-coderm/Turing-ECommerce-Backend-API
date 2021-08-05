const express=require('express')
const knex=require('../database/db')
const routs=express.Router()
routs.use(express.json())

routs.get('/categories',(req,res)=>{
    knex.select("*").from('category').then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })
})

routs.get('/categories/:category_id',(req,res)=>{
    const category_id=req.params.category_id 
    knex.select('*').from('category').where('category_id',category_id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })

})

routs.get('/categories/inproduct/:product_id',(req,res)=>{
    const product_id=req.params.product_id
    knex.select('*').from('category').join('product_category',function(){
        this.on('category.category_id', 'product_category.category_id')
    }).where('product_category.product_id',product_id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })
});



routs.get('/categories/indepartment/:department_id',(req,res)=>{
    const department_id=req.params.department_id
    knex.select('category_id','name','description','department_id').from('category').where('department_id',department_id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })
})

module.exports=routs;
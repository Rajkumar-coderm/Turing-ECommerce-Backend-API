const express=require('express');
const knex=require('../database/db');
const routs=express()
routs.use(express.json())

// get data of tax...
routs.get('/tax',(req,res)=>{
    knex.select('*').from('tax').then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })
});

// get tax using tax_id
routs.get('/tax/:tax_id',(req,res)=>{
    const tax_id=req.params.tax_id;
    knex.select('*').from('tax').where('tax_id',tax_id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })
});

module.exports=routs;
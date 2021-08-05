const express=require('express');
const knex=require('../database/db');
const routs=express();
routs.use(express.json())

routs.get('/shipping/regions',(req,res)=>{
    knex.select('*').from('shipping_region').then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })
})


routs.get('/shipping/regions/:shipping_region_id',(req,res)=>{
    const shipping_region_id=req.params.shipping_region_id;
    knex.select('*').from('shipping_region').where('shipping_region_id',shipping_region_id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })
})

module.exports=routs;
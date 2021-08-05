const express=require('express')
const knex=require('../database/db')
const routs=express.Router()
routs.use(express.json())

routs.get('/attributes',(req,res)=>{
    knex.select('*').from('attribute').then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })
});

routs.get('/attributes/:attribute_id',(req,res)=>{
    const attribute_id =req.params.attribute_id;
    knex.select("*").from('attribute').where('attribute_id',attribute_id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })
});

routs.get('/attributes/value/:attribute_id',(req,res)=>{
    const attribute_id=req.params.attribute_id;
    knex.select('attribute_value_id','value').from('attribute_value').where('attribute_id',attribute_id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })
});

routs.get('/attributes/inproduct/:product_id',(req,res)=>{
    const product_id=req.params.product_id;
    knex.select('*').from('attribute').join('attribute_value',function(){
        this.on('attribute_value.attribute_value_id','attribute_value.attribute_id')
    }).join('product_attribute',function(){
        this.on('attribute_value.attribute_value_id','product_attribute.attribute_value_id')
    }).where('product_attribute.product_id',product_id).then((data)=>{
        const data1=[]
        for (i of data){
            var dic={
                attribute_name:i.name,
                attribute_value_id:i.attribute_value_id,
                attribute_value : i.value
            }
            data1.push(dic)
        }
        res.send(data1)
    }).catch((err)=>{
        res.send(err)
    })
})
module.exports=routs;
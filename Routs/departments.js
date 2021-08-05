const express =require('express');
const knex=require('../database/db')
const routs=express.Router()
routs.use(express.json())

routs.get('/departments',(req,res)=>{
    knex.select('*').from('department').then((data)=>{
        res.send(data)
        console.log(data);
    }).catch((err)=>{
        res.send(err)
    })
})

routs.get('/departments/:department_id',(req,res)=>{
    const department_id = req.params.department_id;
    knex.select ('*').from ('department').where ('department_id',department_id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })

})

module.exports=routs;
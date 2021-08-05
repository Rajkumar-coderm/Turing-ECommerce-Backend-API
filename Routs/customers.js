const express=require('express');
const knex=require('../database/db')
const routs=express();
routs.use(express.json())


// Resister a costemer as singup
routs.post('/costemers/register',(req,res)=>{
    if (req.body.name===undefined || req.body.email=== undefined || req.body.password===undefined || req.body.credit_card===undefined || req.body.address_1===undefined || req.body. address_2===undefined || req.body.city===undefined || req.body.region==undefined || req.body.postal_code===undefined ||req.body.country===undefined || req.body.day_phone===undefined || req.body.eve_phone===undefined || req.body.mob_phone===undefined){
        res.send({message:"please fill the dettails and then singup"})
    }else{
        knex.select("*").from('shipping_region').then((data)=>{
            console.log(data[0].shipping_region_id);
            var user={name:req.body.name,email:req.body.email,password:req.body.password,credit_card:req.body.credit_card,address_1:req.body.address_1,address_2:req.body.address_2,city:req.body.city,region:req.body.region,postal_code:req.body.postal_code,country:req.body.country,shipping_region_id:data[0].shipping_region_id,day_phone:req.body.day_phone,eve_phone:req.body.eve_phone,mob_phone:req.body.mob_phone}
            knex('customer').insert(user).then((data)=>{
                res.send({message:"user singup succesfully"})
            }).catch((err)=>{
                res.send({message:"singup unseccesfully"})
            })
        })
    }
    
});

// Genarate token and login costemer..
const {generateAccessToken}=require('../auth/jwt');
routs.post('/customers/login',(req,res)=>{
    if (req.body.email===undefined || req.body.password===undefined){
        res.send({message:"plase fill the email or password"})
    }else{
        knex.select('*').from('customer').where('email',req.body.email).then((data)=>{
            if(data[0].password==req.body.password){
                const user={name:data[0].name,customer_id:data[0].customer_id}
                const token=generateAccessToken(user)
                res.cookie("token",token)
                res.send({message:"login seccesfully..."})

            }else{
                res.send({message:"password invalid"})
            }

        })
    }
})

// Get a customer by ID. The customer is getting by Token.
const {authenticateToken}=require('../auth/jwt');
routs.get('/customers/data',authenticateToken,(req,res)=>{
    const data1=req.data.customer_id;
    knex.select('*').from('customer').where('customer_id',data1).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })
})

// Get update a data in within whose costemer already login.

routs.put('/costemer/update',authenticateToken,(req,res)=>{
    const customer_id=req.data.customer_id;
    knex('customer').where("customer_id",customer_id).update({
        'name': req.body.name,
        'email': req.body.email,
        'password': req.body.password,
        'day_phone': req.body.day_phone,
        'eve_phone': req.body.eve_phone,
        'mob_phone': req.body.mob_phone
    }).then((data)=>{
        res.send({message:"seccesfully update data"})
    }).catch((err)=>{
        res.send(err)
    });
});

// update address in costemer using customer_id
routs.put('/customer/address',authenticateToken,(req,res)=>{
    const customer_id=req.data.customer_id;
    knex('customer').where('customer_id',customer_id).update({
        'address_1':req.body.address_1,
        'address_2':req.body.address_1 
    }).then((data)=>{
        res.send({message:"Address update done.."})
    }).catch((err)=>{
        res.send({message:"user Adress is not update"})
    })
})

// update creadite_card in using user id.
routs.put('/costomers/creditcard',authenticateToken,(req,res)=>{
    const customer_id=req.data.customer_id;
    knex('customer').where('customer_id',customer_id).update({
        'credit_card':req.body.credit_card
    }).then((data)=>{
        res.send({message:"credit_card update seccesfully..."})
    }).catch((err)=>{
        res.send({message:"credit_card not a updated"})
    })
})


module.exports=routs;

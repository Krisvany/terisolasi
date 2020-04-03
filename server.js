const express = require('express')
const bodyParser = require('body-parser')
const mysql=require('mysql')
const jwt = require('jsonwebtoken')

const app = express()

const secretKey = 'randomsecretkeyforsecurity'


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

const db= mysql.createConnection({
    host:'127.0.0.1',
    port:'3306',
    user:'root',
    password:'',
    database:'terisolasi'
})
db.connect((err)=>{
    if(err)throw err
    console.log('Database connected')
})

const isAuthorized=(req, res, next)=>{
    if(typeof req.headers['header']=='undefined'){
        return res.status(403).json({
            success:false,
            message:'Unauthorized'
        })
    }
    let token = req.headers['header']

    jwt.verify(token, secretKey, (err, decoded)=>{
        if(err){
        return res.status(401).json({
            success:false,
            message:'Unauthorized'
     
       })
    }
})
       next()
    
}
app.get('/',(req, res)=>{
    res.json({
        'success':true,
        'message' : 'Selamat Datang'
    })})
app.post('/loginadmin', (req, res) => {
    let data = req.body

    if(data.username =='admin'&& data.password =='admin'){
        let token = jwt.sign(data.username+ '|' + data.password,secretKey)
        res.json({     
            succes: true,
            mesage:'Login success',
            token:token
        })}
res.json({
    success:false,
    message: 'Login gagal'
})})
//login user
app.post('/login', (req, res) => {
    let data = req.body

    if(data.username =='user'&& data.password =='user'){
        let token = jwt.sign(data.username+ '|' + data.password,secretKey)
        res.json({
            succes: true,
            mesage:'Login success',
            token:token
        })}
res.json({
    success:false,
    message: 'Login gagal'
})})
//endpoint
app.get('/daerah',isAuthorized,(req,res) =>{
    let sql=`
    select*from daerah`

    db.query(sql,(err,res) =>{
        if(err)throw err
        res.json({
            success:true,
            message: 'success',
            data:result
        })})})
            
app.post('/daerah',isAuthorized,(req,res)=>{
    let data = req.body
    let sql=`
    insert into daerah(id,kota,jalan,provinsi,waktu)
    values('`+data.id+`','`+data.kota+`','`+data.jalan+`','`+data.provinsi+`','`+data.waktu+`');
    `
    db.query(sql,(err, res)=>{
        if(err) throw err
    })
    result.json({
        success: true,
        message: 'data is ready'
    })
})

app.put('/daerah/:id', isAuthorized,(req,res)=>{
    let data = req.body
    
    let sql=`
    update daerah
    set kota='`+data.kota+`',jalan='`+data.jalan+`',provinsi='`+data.provinsi+`',waktu='`+data.waktu+`''
    where id = `+req.params.id+`
    `
    db.query(sql,(err,res)=>{
        if(err)throw err
    })
    result.json({
        success:true,
        message:'Data sudah terupdate'
    })

})

app.delete('/daerah/:id',isAuthorized,(req, res)=>{
    let sql=`
    delete from daerah where id=`+req.params.id+`
    `

    db.query(sql,(err,res)=>{
if(err)throw err
})

result.json({
    success:true,
    message:'Data telah terhapus'
})

})


app.listen(3000,()=>{
    console.log('App is running on port 3000')
})
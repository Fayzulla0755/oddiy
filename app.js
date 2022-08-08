const express=require('express')
const config=require('config')
const mongoose=require('mongoose')


const app=express()
app.use('/api/auth', require('./routers/auth.routes'))

const PORT=config.get('port') || 3000

async function start(){
    try{
        await mongoose.connect(config.get('mongoUri'),{
            useNewUrlParser:true,
            useUnifisdTopology:true,
            useCreateIndex:true
        })
        app.listen(PORT ,()=>console.log('App has been started port:${PORT}'))
    }catch(e){
        console.log('Server error', e.massage)
        process.exit(1)
    }
}

start()

// 



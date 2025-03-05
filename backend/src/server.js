import express from 'express'
import 'dotenv/config'

import cookieParser from 'cookie-parser'
import { connectToDb } from './lib/db.js'
import authRouter from './routes/authRoute.js'
import userRouter from './routes/userRoute.js'
import messageRouter from './routes/messageRoute.js'
import { app,server } from './socket/socket.js'

const PORT = process.env.PORT || 5000
app.use(express.json())
app.use(cookieParser())


app.use('/api/auth',authRouter)
app.use('/api/users',userRouter)
app.use('/api/messages',messageRouter)

const startServer = ()=>{
    try {
        connectToDb()
        server.listen(PORT,()=>{
            console.log(`server is running now on port ${PORT}`)
        })
    } catch (error) {
        console.log(`server is not running right now`)
    }
}
startServer()
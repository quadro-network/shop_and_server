import config from 'dotenv/config'
import express from 'express'
import sequelize from './sequelize.js'
import * as mapping from './models/mapping.js'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import cookieParser from 'cookie-parser'
import router from './routes/index.js'
import errorMiddleware from './middleware/errorMiddleware.js'
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000

const app = express()
// Cross-Origin Resource Sharing
app.use(cors({origin: ['https://techno-service.vivero.tech'], credentials: true}))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://techno-service.vivero.tech');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
    
  });
// middleware для работы с json
app.use(express.json())
// middleware для статики (img, css)
app.use(express.static('static'))
// middleware для загрузки файлов
app.use(fileUpload())
// middleware для работы с cookie
app.use(cookieParser(process.env.SECRET_KEY))
// все маршруты приложения
app.use('/api', router)

// обработка ошибок
app.use(errorMiddleware)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log('Сервер запущен на порту', PORT))
    } catch(e) {
        console.log(e)
    }
}

start()

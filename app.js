const express = require ('express');
const dotenv = require ('dotenv');
const path = require ('path');
const MongoStore = require('connect-mongo')
const session = require ('express-session');
const connectDb = require('./config/db');
const router = require('./routes/user/userRoutes')
const morgan = require ('morgan');
const cors = require('cors');

const app = express();
dotenv.config();
connectDb();


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,'public')));
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge:1000 * 60 * 60 * 24 * 30 }
  })
);


app.use('/',router);



const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`✅ Server running on http://localhost:${PORT}`);
}
)




const bodyParser = require("body-parser");
const cors = require("cors");
const exp = require("express");
const dotenv = require("dotenv");
const router = require("./router/routes");
const mongoose = require("mongoose");
const session = require("express-session")
dotenv.config();
const passport = require("passport");
const PORT = process.env.PORT;
const app = exp();
app.use(cors());
app.use(bodyParser.json());
app.use(session({
    secret: "secret",
    resave: false ,
    saveUninitialized: true ,
  
}));
app.use(passport.initialize())
app.use(passport.session())
app.use("/",router);


// Initializing server......
app.listen(PORT,()=>{
    console.log(`Server started at PORT NO ${PORT}`);
    mongoose.connect(process.env.mongoDB).then((res)=>console.log("....Database connected")).catch((err)=>{
        console.log(err);
    })
});
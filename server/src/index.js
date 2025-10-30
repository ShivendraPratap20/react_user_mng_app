require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 8000;
require("./db/conn");
const path = require("path");
const auth = require("./middleware/auth.js");
const router = require("./routes/index.js");


app.use(cors({
    origin: 'https://reactusermngapp.vercel.app',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/", auth, router );

app.listen(PORT, () => {
    console.log(`Server is started at port ${PORT}`);
})
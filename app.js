const express = require('express');
const path = require('path');
const port = 8080; // this is default port
const db = require('./models/index');
const fileUpload = require('express-fileupload');

const moviesRouter = require('./routes/movies');

const app = express();



app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

//I know that multer is a bit better.
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
//Setup view engine for upload interface
app.set("views", path.join(__dirname, "public/views"));
app.set("view engine", "hbs");


app.use("/api/v1", moviesRouter);

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

const app = express();

// Some nice middleware :)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Add your own middlware here!

export default app;

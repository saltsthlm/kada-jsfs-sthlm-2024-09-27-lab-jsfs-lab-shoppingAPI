import express from 'express';
import path from 'path';

const app = express();

// Some nice middleware :)
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Add your own middlware here!

export default app;

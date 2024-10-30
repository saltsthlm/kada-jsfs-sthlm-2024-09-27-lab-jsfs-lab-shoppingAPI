import express, { Request, Response } from 'express';
import path from 'path';
import config from './config';
const app = express();

// Some nice middleware :)
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', (req: Request, res: Response) => {

    const productsPath = config.products.db;
    res.send(productsPath);

})
// Add your own middlware here!

export default app;

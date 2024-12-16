import dotenv from 'dotenv';
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cartRouter from './routes/card.route';

dotenv.config();

const app: Application = express();
const port: number = parseInt(process.env.PORT || '5005', 10);

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use('/cart', cartRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

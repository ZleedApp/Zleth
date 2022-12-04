import dotenv     from 'dotenv';
import express    from 'express';
import cors       from 'cors';
import bodyparser from 'body-parser';
import fs         from 'fs';
import path       from 'path';
import mongoose   from 'mongoose';

dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));

mongoose.connect(process.env.DB_URI!)
  .then(() => console.log('Connected to database!'));

fs.readdirSync(path.join(__dirname, 'endpoints', 'v1'))
  .filter(file => file.endsWith('.ts'))
  .forEach(endpointFile =>
    require(path.join(__dirname, 'endpoints', 'v1', endpointFile)).addEndpoint(app, mongoose)
  );

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(process.env.API_PORT, () => {
  console.log(`Listening on 0.0.0.0:${process.env.API_PORT}`);
});
import express    from 'express';
import cors       from 'cors';
import bodyparser from 'body-parser';
import fs         from 'fs';
import path       from 'path';

const app = express();

app.use(bodyparser.json());
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(process.env.PORT, () => {
    console.log('Listening on port 3000');
});
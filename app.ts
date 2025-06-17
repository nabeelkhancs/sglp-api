import 'dotenv/config';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import v1Routes from './src/routes/v1';
import v2Routes from './src/routes/v2';
import { errorHandler, handleAPIResponse } from './src/middlewares';


const app: Express = express();
const port: number | string = process.env.PORT || 3000;

app.use('/v2', express.static('../BotDocs'));

app.use(bodyParser.json());
app.use(handleAPIResponse);

const corsOptions: cors.CorsOptions = {
  origin: '*',
  credentials: true,
};

app.use(cors(corsOptions));


app.use('/v1', v1Routes);
app.use('/v2', v2Routes);

app.use(errorHandler);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

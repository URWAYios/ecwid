import express from 'express';
import fetch from 'node-fetch';
import reqeustpayment from './routes/reqeustpayment.js';
import cors from 'cors';
import 'dotenv/config';

const PORT = process.env.PORT || 8000;
const corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();

app.use(express.static('./public'));
app.use(cors(corsOptions));
app.use('/v1/urway/ecwid', reqeustpayment);

app.listen(PORT, () => {
	console.log('app is running on ' + PORT);
	console.log(process.env.TEST + '.....' + process.env.LIVE);
});

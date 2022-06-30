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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./public'));
app.use(cors(corsOptions));
app.use('/v1/urway/ecwid', reqeustpayment);

app.use((err, req, res, next) => {
	console.error('the app route', err);
	res.status(500).send(err);
});
app.listen(PORT, () => {
	console.log('app is running on ' + PORT);
});

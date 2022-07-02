import express from 'express';
import fetch from 'node-fetch';
import reqeustpayment from './routes/payment.js';
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
// app.get('/pay', (req, res, next) => {
// 	let dataLoad = {
// 		action: '1',
// 		amount: '100',
// 		country: 'SA',
// 		currency: 'SAR',
// 		merchantIp: '10.10.10.101',
// 		password: 'rushd@URWAY_123',
// 		requestHash: 'f4d58e7c3cf3872771b13acc1cc829e0b64a94ff08dcb77d8e8097a9870a0570',
// 		terminalId: 'rushd',
// 		trackid: '1650569707633',
// 		udf2: 'https://www.google.com',
// 	};
// 	fetch('https://payments.urway-tech.com/URWAYPGService/transaction/jsonProcess/JSONrequest', {
// 		method: 'POST',
// 		header: {
// 			'Content-type': 'application/json',
// 		},
// 		body: JSON.stringify(dataLoad),
// 	})
// 		.then((data) => {
// 			// console.log(data);
// 			return data.json();
// 		})
// 		.then((data) => {
// 			console.log(data);
// 			res.json(data);
// 		})
// 		.catch((e) => {
// 			console.log(e);
// 			next(e);
// 		});
// });

app.use((err, req, res, next) => {
	console.error('final exit route', err);
	res.status(500).json({
		error: err.message || 'unknown error',
		errrCode: 500,
	});
});
app.listen(PORT, () => {
	console.log('app is running on ' + PORT);
});

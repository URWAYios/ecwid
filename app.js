import express from 'express';
import fetch from 'node-fetch';
import reqeustpayment from './routes/payment.js';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

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
app.get('/process_payment', (req, res) => {
	const __filename = fileURLToPath(import.meta.url);
	console.log(__filename);
	// res.sendFile('/public/process.html', path.dirname(__filename));
	res.sendFile(path.join(path.dirname(__filename), './public', 'process.html'));
});
app.use((err, req, res, next) => {
	console.error('final exit route', err);
	res.status(500).json({
		error: err.message || 'unknown error',
		errrCode: err.status || 500,
	});
});
app.listen(PORT, () => {
	console.log('app is running on ' + PORT);
});

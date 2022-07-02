import express from 'express';
import { EncryptionHelper, decryptData } from '../controller/decode.js';
import { makePayment } from '../controller/makePayment.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
	if (req.body) {
		try {
			let data = await decryptData(process.env.CLIENT_SECRET, req.body.data);
			if (typeof data == 'object') {
				console.log('enter checking the typeof');
				res.status(200).send(data);
			}
			let paymentData = JSON.parse(data);
			let response = await makePayment(paymentData);
			console.log(response);
			res.status(200).redirect(response);
		} catch (err) {
			console.log('from payment route', err.message);
			next(err);
		}
	}
});
// router.post('/validate_payment', (req, res) => {
// 	console.log(req.query);
// 	res.send(req.query);
// });
// router.post('/print', (req, res) => {
// 	console.log(req.body);
// 	res.status(200).send(req.body);
// });

export default router;

import express from 'express';
import { EncryptionHelper, decryptData } from '../controller/decode.js';
import { makePayment } from '../controller/makePayment.js';
import makeHash from '../utilit/hash256.js';
import { makeRequest } from '../controller/fetch.js';
import cookieHelper from '../utilit/cookieHelper.js';
const router = express.Router();

// const cookieHelper = (req, res, next) => {
// 	console.log('cookies', req.cookies);
// 	next();
// };
router.post('/', async (req, res, next) => {
	if (req.body) {
		try {
			let data = await decryptData(process.env.CLIENT_SECRET, req.body.data);
			if (typeof data == 'object') {
				console.log('enter checking the typeof', typeof data);
			}
			let paymentData = JSON.parse(data);
			const { referenceTransactionId } = paymentData.cart.order;
			const { storeId, token } = paymentData;
			const { merchantkey } = paymentData.merchantAppSettings;
			res.cookie('refrenceTransactionId', referenceTransactionId);
			res.cookie('storeId', storeId);
			res.cookie('token', token);
			res.cookie('merchantKey', merchantkey);
			let response = await makePayment(paymentData);
			if (response.error) {
				let updateUrl = `https://app.ecwid.com/api/v3/${req.cookies.storeId}/orders/${req.cookies.refrenceTransactionId}?token=${req.cookies.token}`;
				updateReqeust = await makeRequest(updateUrl, 'PUT', { paymentStatus: 'INCOMPLETE' });
				console.log('initial to pg failed');
				res.status(200).redirect(`${response.returnUrl}&errorMsg=somthing_went_wrong`);
			}
			console.log(response);
			if (!response.error) res.status(200).redirect(response);
		} catch (err) {
			console.log('from payment route', err.message);
			next(err);
		}
	}
});
router.post('/validate_payment', async (req, res, next) => {
	const { TranId, TrackId, amount, UserField1, Result, ResponseCode, responseHash } = req.body;
	let updateUrl = `https://app.ecwid.com/api/v3/${req.cookies.storeId}/orders/${req.cookies.refrenceTransactionId}?token=${req.cookies.token}`;
	let mer = req.cookies.merchantKey;
	mer = mer + '';
	mer = mer.trim();
	let hash = await makeHash(`${TranId}|${mer}|${ResponseCode}|${amount}`);
	let fullReturnUrl = `${UserField1}&clientId=${process.env.CLIENT_KEY}`;
	let updateReqeust;
	try {
		if (hash === responseHash) {
			if (Result === 'Successful' || ResponseCode === '000' || Result === 'Success') {
				// update the error before going to the payment page
				updateReqeust = await makeRequest(updateUrl, 'PUT', { paymentStatus: 'PAID' });
				if (updateReqeust.error) {
					console.log('to paid failed', updateReqeust, updateReqeust.body);
				}
				res.status(200).json({
					result: 'success',
					code: 200,
					urlToReturn: fullReturnUrl,
				});
			} else {
				updateReqeust = await makeRequest(updateUrl, 'PUT', { paymentStatus: 'INCOMPLETE' });
				console.log('transaction failed', updateReqeust);
				let urlWithReason = `${fullReturnUrl}&errorMsg=somthing_went_wrong`;
				res.status(400).json({
					result: 'failure',
					code: 400,
					urlToReturn: urlWithReason,
				});
			}
		} else {
			res.status(400).json({
				result: 'failure',
				code: 400,
				urlToReturn: `${fullReturnUrl}&errorMsg=somthing_went_wrong`,
			});
		}
	} catch (err) {
		next(err);
	}
});
export default router;

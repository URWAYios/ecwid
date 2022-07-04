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
			console.log(response);
			res.status(200).redirect(response);
		} catch (err) {
			console.log('from payment route', err.message);
			next(err);
		}
	}
});
router.post('/validate_payment', cookieHelper, async (req, res, next) => {
	const { TranId, TrackId, amount, UserField1, Result, ResponseCode, UserField3, responseHash, UserField5 } = req.body;
	console.log(UserField5);
	let splitThem = UserField5.split('|');
	console.log(splitThem);
	let token = splitThem[0];
	let referenceTransactionId = splitThem[1];
	let updateUrl = `https://app.ecwid.com/api/v3/${req.cookies.storeId}/orders/${req.cookies.refrenceTransactionId}?token=${req.cookies.token}`;
	console.log('toPaid', updateUrl);
	console.log('the cookie hash', req.cookies.merchantKey);
	console.log('the userfield hash', UserField3);
	let mer = req.cookies.merchantkey;
	console.log('checking the type :', typeof mer);
	mer = mer + '';
	console.log('final after transfer to:', mer);
	console.log('checking the type :', typeof mer);
	let hash = await makeHash(`${TranId}|${UserField3}|${ResponseCode}|${amount}`);
	let hashc = await makeHash(`${TranId}|${mer}|${ResponseCode}|${amount}`);
	console.log('myhashUserfield:', hash);
	console.log('myhashcookies:', hashc);
	console.log('serverhash:', responseHash);
	let fullReturnUrl = `${UserField1}&clientId=${process.env.CLIENT_KEY}`;
	let updateReqeust;
	try {
		if (hash === responseHash) {
			if (Result === 'Successful' || ResponseCode === '000' || Result === 'Success') {
				// update the error before going to the payment page
				updateReqeust = await makeRequest(updateUrl, 'PUT', { paymentStatus: 'PAID' });
				if (updateReqeust.error) {
					console.log(updateReqeust, 'failed to update to paid');
				}
				res.status(200).json({
					result: 'success',
					code: 200,
					urlToReturn: fullReturnUrl,
				});
			} else {
				updateReqeust = await makeRequest(updateUrl, 'PUT', { paymentStatus: 'INCOMPLETE' });
				if (updateReqeust.error) {
					console.log(updateReqeust.error, 'update to incomplete');
					res.status(400).json({
						result: 'failure',
						code: 400,
						urlToReturn: fullReturnUrl,
					});
				}
				let urlWithReason = `${fullReturnUrl}?errorMsg=somthing_went_wrong`;
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
				urlToReturn: UserField1,
			});
		}
	} catch (err) {
		next(err);
	}
});
export default router;

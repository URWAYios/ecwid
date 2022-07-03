import express from 'express';
import { EncryptionHelper, decryptData } from '../controller/decode.js';
import { makePayment } from '../controller/makePayment.js';
import makeHash from '../utilit/hash256.js';
import { makeRequest } from '../controller/fetch.js';
const router = express.Router();

router.post('/', async (req, res, next) => {
	if (req.body) {
		try {
			let data = await decryptData(process.env.CLIENT_SECRET, req.body.data);
			if (typeof data == 'object') {
				console.log('enter checking the typeof', typeof data);
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
router.post('/validate_payment', async (req, res, next) => {
	const { TranId, TrackId, amount, UserField1, Result, ResponseCode, UserField3, responseHash, UserField5 } = req.body;
	console.log(UserField5);
	let splitThem = UserField5.split('|');
	console.log(splitThem);
	let token = splitThem[0];
	let referenceTransactionId = splitThem[1];
	let updateUrl = `https://app.ecwid.com/api/v3/${process.env.STORE_ID}/orders/${referenceTransactionId}?token=${token}`;
	let hash = await makeHash(`${TranId}|${UserField3}|${ResponseCode}|${amount}`);
	console.log('myhash', hash);
	console.log('serverhasg', responseHash);
	let updateReqeust;
	try {
		if (hash === responseHash) {
			if (Result === 'Successful' || ResponseCode === '000' || Result === 'Success') {
				// update the
				updateReqeust = await makeRequest(updateUrl, 'PUT', { paymentStatus: 'PAID' });
				if (updateReqeust.error) {
					console.log(updateReqeust.error, 'failed to update to paid');
				}
				res.status(200).json({
					result: 'success',
					code: 200,
					urlToReturn: UserField1,
				});
			} else {
				updateReqeust = await makeRequest(updateUrl, 'PUT', { paymentStatus: 'INCOMPLETE' });
				if (updateReqeust.error) {
					console.log(updateReqeust.error, 'update to incomplete');
					res.status(400).json({
						result: 'failure',
						code: 400,
						urlToReturn: UserField1,
					});
				}
				let urlWithReason = `${UserField1}?errorMsg=somthing_went_wrong`;
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

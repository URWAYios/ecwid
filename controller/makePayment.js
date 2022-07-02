import { makeRequest } from './fetch.js';
import makeHash from '../utilit/hash256.js';

const makePayment = async (paymentData) => {
	const { referenceTransactionId, id, total, email } = paymentData.cart.order;
	const { terminalid, merchantkey, password, testmode } = paymentData.merchantAppSettings;
	const { currency } = paymentData.cart;
	console.log(paymentData);
	const { returnUrl, storeId, token } = paymentData;
	// first update the order in the ecwid admin panel
	let updateUrl = `https://app.ecwid.com/api/v3/${storeId}/orders/${referenceTransactionId}?token=${token}`;
	try {
		let res = await makeRequest(updateUrl, 'PUT', { paymentStatus: 'AWAITING_PAYMENT' });
		//end of updating the order to AWAITING_PAYMENT
		//making a payment reqeust to urway
		let paymentGateWayUrl = testmode == 'true' ? process.env.TEST : process.env.LIVE;
		let hash = await makeHash(`${id}|${terminalid}|${password}|${merchantkey}|${total}|${currency}`);
		let paymentLoad = {
			terminalId: terminalid,
			password: password,
			amount: total,
			trackid: id,
			action: '1',
			requestHash: hash,
			merchantIp: '10.10.10.10',
			currency: currency,
			customerEmail: email,
			country: 'SA',
			udf2: 'https://urway-ecwid.herokuapp.com/v1/urway/ecwid/validate_payment',
			udf1: returnUrl,
		};
		let payRes = await makeRequest(paymentGateWayUrl, 'POST', paymentLoad);
		let redirectUrl = `${payRes.targetUrl}?paymentid=${payRes.payid}`;
		return redirectUrl;
	} catch (err) {
		throw Error(err);
	}
};

export { makePayment };

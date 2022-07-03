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
		let orderTrack = `${id}#${storeId}`;
		let hash = await makeHash(`${orderTrack}|${terminalid}|${password}|${merchantkey}|${total}|${currency}`);
		let paymentLoad = {
			terminalId: terminalid,
			password: password,
			amount: total,
			trackid: `${id}#${storeId}`,
			action: '1',
			requestHash: hash,
			merchantIp: '10.10.10.10',
			currency: currency,
			customerEmail: email,
			country: 'SA',
			udf2: 'https://urway-ecwid.herokuapp.com/process_payment',
			udf1: returnUrl,
			udf3: merchantkey,
			udf4: token,
			udf5: referenceTransactionId,
		};
		let payRes = await makeRequest(paymentGateWayUrl, 'POST', paymentLoad);
		// here I should also handle error in case the reqeust to the payemnt gateway get failed
		let redirectUrl = `${payRes.targetUrl}?paymentid=${payRes.payid}`;
		return redirectUrl;
		//end of payment request
	} catch (err) {
		throw Error(err);
	}
};

export { makePayment };

import { makeRequest } from './fetch.js';
const makePayment = async (paymentData) => {
	const { referenceTransactionId } = paymentData.cart.order;
	console.log(referenceTransactionId);
	console.log(paymentData.cart);
	const { erminalid, merchantkey, password, mode, returnUrl, storeId, token } = paymentData;
	// first update the order in the ecwid admin panel
	let updateUrl = `https://app.ecwid.com/api/v3/${storeId}/orders/${referenceTransactionId}?token=${token}`;
	try {
		let res = await makeRequest(updateUrl, 'PUT', { paymentStatus: 'AWAITING_PAYMENT' });
		//end of updating the order to AWAITING_PAYMENT
		//making a payment reqeust to urway
		return res;
	} catch (err) {
		return err;
	}
};

export { makePayment };

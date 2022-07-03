const url = new URLSearchParams(location.search);
const paymentData = {};

for (const [key, value] of url) {
	paymentData[key] = value;
}

const makeRequest = async (data) => {
	let sendReqest = await fetch('https://urway-ecwid.herokuapp.com/v1/urway/ecwid/validate_payment', {
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
		},
		body: JSON.stringify(data),
	});
	let res = await sendReqest.json();
	console.log(res);
};
console.log(paymentData);
makeRequest(paymentData);

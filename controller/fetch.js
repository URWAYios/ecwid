import fetch from 'node-fetch';

const makeRequest = async (url, type, body) => {
	let res = await fetch(url, {
		method: type,
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
		body: JSON.stringify(body),
	});
	console.log(res);
	if (res.status !== 200) {
		throw new Error('something wrong occured');
	} else {
		if (type != 'GET') {
			let result = await res.json();
			return result;
		} else {
			return 'sucess';
		}
	}
};

export { makeRequest };

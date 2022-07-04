import fetch from 'node-fetch';

const makeRequest = async (url, type, body) => {
	let res = await fetch(url, {
		method: type,
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
			'cache-control': 'no-cache',
		},
		body: JSON.stringify(body),
	});
	if (res.status !== 200) {
		let re = await res.json();
		return {
			error: 'err',
			code: res.status,
			body: re,
		};
	} else {
		let result = await res.json();
		console.log(result);
		return result;
	}
};

export { makeRequest };

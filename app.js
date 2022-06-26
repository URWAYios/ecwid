import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.static('./public'));

app.get('/user', (req, res) => {
	fetch('https://dummyapi.io/data/v1/user?limit=10', {
		headers: {
			'app-id': '62b87ff2698f406b46f32372',
		},
	})
		.then((data) => data.json())
		.then((data) => console.log(data));

	res.send('ecwid integration');
});
app.listen(8000, () => {
	console.log('app is running on 5000');
});

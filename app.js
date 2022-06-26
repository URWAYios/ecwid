import express from 'express';

const app = express();

app.get('/', (req, res) => {
	res.send('ecwid integration');
});
app.listen(8000, () => {
	console.log('app is running on 5000');
});

console.log('version2');

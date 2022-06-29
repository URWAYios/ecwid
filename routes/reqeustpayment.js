import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
	console.log('you hit urway api');
	res.status(200);
});
router.post('/print', (req, res) => {
	console.log(req.body);
	res.status(200);
});

export default router;

const cookieHelper = (req, res, next) => {
	console.log('cookies', req.cookies);
	next();
};

export default cookieHelper;

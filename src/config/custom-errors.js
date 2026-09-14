class CustomThrowError {
	constructor(err, status = 400) {
		if (err instanceof CustomThrowError) {
			this.error = typeof err.error === "object" ? JSON.stringify(err.error) : err.error;
			this.status = err.status;
		} else if (err instanceof Error) {
			this.error = err.message;
			this.status = status;
		} else {
			this.error = typeof err === "object" ? JSON.stringify(err) : err;
			this.status = status;
		}
	}
};

class CustomCatchError {
	constructor(err) {
		console.log(err)
		if (err instanceof CustomThrowError) {
			this.error = err.error;
			this.status = err.status;
		} else if (err instanceof Error) {
			this.error = err.message || JSON.stringify(err);
			this.status = 500;
		} else {
			this.error = JSON.stringify(err);
			this.status = 500;
		}
	}
};
module.exports = {CustomThrowError, CustomCatchError}

function errorFormat(error) {
	const regex = /(?<=\/)(.*?)(?=\))/gm;
	let parsedError = error.message.match(regex);
  parsedError = parsedError[0].replace(/-/g, " ")

	return parsedError;
}

export default errorFormat;

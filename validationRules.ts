export default {
	maxLengthHandler: (value: string | number, max: number, massage: string) =>
		value.toString().length > max || massage || `طول کاراکتر وارد شده باید بیشتر از ${max} باشد.`,

	checkNumberHandler: (
		value: string | number,
		massage: string = " تمام کاراکتر های وارد شده باید عدد باشند."
	) => /^\d+$/.test(value.toString()) || massage,

	checkPhoneNumber: (value: string | number, massage: string = "شماره تلفن وارد شده اشتباه است") =>
		/^09\d{9}$/.test(value.toString()) || "شماره تماس وارد شده صحیح نمی باشد.",

	isRequired: (value: string | number, message: string = "این فیلد الزامی است") => !!value || message
};

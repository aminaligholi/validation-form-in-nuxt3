export default el =>
	new Promise((resolve, reject) => {
		try {
			// انتخاب همه عناصر با کلاس '.auto-validation-form' داخل المان 'el' داده شده
			const inputGroups = el.querySelectorAll(".auto-validation-form");

			// فراخوانی رویدادهای focus و blur بر روی هر input یا textarea برای آغاز اعتبارسنجی
			inputGroups.forEach(inputGroup => {
				const input = inputGroup.querySelector("input, textarea");
				if (input) {
					input.focus();
					input.blur();
				}
			});

			// منتظر یک تاخیر کوتاه بمانید تا اطمینان حاصل شود که تمام اعتبارسنجی‌ها فعال شده‌اند
			setTimeout(() => {
				let valid = true;

				// بررسی اینکه آیا هر گروه ورودی خطای اعتبارسنجی دارد یا خیر
				inputGroups.forEach(inputGroup => {
					if (inputGroup.classList.contains("error-input-validation")) {
						console.log("خطا در اعتبارسنجی یافت شد");
						valid = false;
					}
				});

				if (valid) {
					resolve("Form is valid");
				} else {
					reject(new Error("Form has validation errors"));
				}
			}, 20);
		} catch (error) {
			reject(new Error("An error occurred during validation: " + error));
		}
	});

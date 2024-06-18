<template>
	<form
		ref="testForm"
		class="container-step-1"
	>
		<h1 class="title-login">پیشخوان24</h1>
		<span class="dis-input"> شماره تلفن خود را وارد کنید.</span>
		<base-form-input-wrapper-b
			v-model="loginSt._phoneNumber"
			v-model:is-valid="isValid"
			label="شماره تلفن همراه"
			type="tel"
			input-mode="tel"
			placeholder="شماره تلفن همراه"
			text-align="center"
			label-bg="#111E24"
			input-color="#fff"
			:rules="rulesForPhoneNumber"
		/>
		<base-button
			text="تایید و ادامه"
			is-wide
			:loading="loginSt._loadingBtn"
			@click.self="validateAndSubmitPhoneNumber()"
		/>
		<p
			class="change-option-login"
			@click="loginSt.changeOptionLogin('staticPassword')"
		>
			<!--  -->
			ورود بارمزعبور
		</p>
		<inquiry-messages
			v-model="loginSt._showInquiryMessage"
			is-error-critical-message
			:message="loginSt._errorMessageShowInquiryMessage"
		/>
	</form>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import validationForm from "@/utils/validationForm";
import validationRules from "@/utils/validationRules";
const testForm = ref(null);
const loginSt = useLoginStore();
const isValid = ref(true);
const rulesForPhoneNumber = computed(() => [
	v => validationRules.isRequired(v),
	v => validationRules.checkPhoneNumber(v)
]);
const validateAndSubmitPhoneNumber = () => {
	validationForm(testForm.value)
		.then(() => {
			loginSt.submitPhonNumber();
		})
		.catch(() => {
			loginSt._loadingBtn = false;
		});
};
</script>

<style scoped lang="scss">
.container-step-1 {
	@include media(lg) {
		max-width: toRem(380px);
	}
	width: toRem(380px);
	max-width: toRem(380px);
	display: flex;
	flex-direction: column;
	padding-inline: toRem(10px);
	gap: toRem(21px);
}
.dis-input {
	color: $white;
	width: 100%;
}
.title-login {
	color: $white;
	@include text-bold24;
}
.change-option-login {
	@include text-bold14;
	color: $secondary;
	margin-inline: auto;
	cursor: pointer;
}
</style>

function useLogin() { throw new Error("Function not implemented."); }

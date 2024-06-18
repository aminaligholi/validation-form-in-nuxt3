<template>
	<div :class="['auto-validation-form base-input-group', {'error-input-validation': !isValid}]">
		<div :class="classListCmp">
			<input
				ref="input"
				v-bind="$attrs"
				v-model="internalValue"
				v-rule-input="{rules: props.rules}"
				:class="[' base-input', inputClass, classListCmp]"
				:type="type"
				:readonly="readonly"
				:inputmode="inputMode"
				@input="update"
			/>
			<label class="base-input-group__content__label">
				{{ props.label }}
			</label>
			<p
				v-if="!!errorMessage"
				class="base-input-group__error"
			>
				{{ errorMessage }}
			</p>
			<p
				v-if="hasTimer"
				class="count-down"
			>
				<span
					v-if="_countDown"
					class="count-down_Second"
				>
					<span> ثانیه </span>
					{{ _countDown }}
				</span>
				<span
					v-else
					@click="actionEvent()"
				>
					ارسال مجددکد
				</span>
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {useIntervalFn} from "@vueuse/core";

const props = defineProps({
	rules: {
		type: Array,
		default: () => []
	},
	inputColor: {
		type: String,
		default: "#333"
	},
	label: {
		type: String,
		default: ""
	},
	labelBg: {type: String, default: "#fff"},
	inputMode: {
		type: String,
		default: "text",
		validator: str =>
			["none", "text", "decimal", "numeric", "tel", "search", "email", "url", "password"].includes(str)
	},
	inputClass: {type: String, default: ""},
	rtl: {
		type: Boolean,
		default: false
	},
	readonly: {
		type: Boolean,
		default: false
	},
	disabled: {
		type: Boolean,
		default: false
	},
	textAlign: {
		type: String,
		default: "right",
		validator: str => ["center", "right", "left"].includes(str)
	},
	type: {
		type: String,
		default: "text"
	},
	hasTimer: {
		type: Boolean,
		default: false
	},
	setTimer: {
		type: Number,
		default: 120
	},
	returnSendCode: {
		type: Function,
		default: () => ({})
	}
});

const internalValue = defineModel<string | number>({
	required: true
});

// const isValid = ref(true);
const isValid = defineModel("isValid", {type: Boolean});

const errorMessage = ref("");

const VRuleInput = {
	mounted(el, binding, vnode, prevVnode) {
		el.addEventListener("focus", () => {
			functionForDirective(el, binding, vnode, prevVnode);
		});
	},
	updated(el, binding, vnode, prevVnode) {
		functionForDirective(el, binding, vnode, prevVnode);
	}
};

const functionForDirective = (el, binding, vnode, prevVnode) => {
	const target = el.value;
	const rules = binding.value.rules;
	isValid.value = true;
	let errorMessageText = "";

	for (const ruleTest of rules) {
		const res = ruleTest(target);
		if (typeof res !== "boolean") {
			isValid.value = false;
			errorMessageText = res;
			break;
		} else if (!res) {
			isValid.value = false;
			break;
		}
	}

	if (!isValid.value && errorMessage.value !== errorMessageText) {
		errorMessage.value = errorMessageText;
	} else if (isValid.value && errorMessage.value) {
		errorMessage.value = "";
	}
};

const _countDown = ref(props.setTimer);
const {pause, resume} = useIntervalFn(() => {
	if (!props.hasTimer) {
		pause();
	}
	_countDown.value -= 1;
	if (_countDown.value === 0) {
		pause();
	}
}, 1000);

const actionEvent = async () => {
	const res = await props.returnSendCode();
	if (res) {
		_countDown.value = props.setTimer;
		resume();
	}
};

const classListCmp = computed(() => ({
	"base-input-group__content": true,
	"is-valid": isValid.value,
	"base-input__error": !isValid.value,
	"base-input__disabled": props.disabled,
	"base-input__ltr": !props.rtl,
	[`text-${props.textAlign}`]: props.textAlign
}));
</script>

<style lang="scss" scoped>
.base-input-group {
	margin-bottom: 25px;
	position: relative;
	&__content {
		position: relative;

		&__label {
			box-sizing: border-box;
			position: absolute;
			margin: 2px 0;
			pointer-events: none;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			top: 0;
			visibility: hidden;
			background-color: $white;
			height: 28px;
			left: auto;
			line-height: 23px;
			padding: 0 16px;
			right: 8px;
			transition: top 0.2s ease;
			color: $gray6;
		}

		.base-input {
			@include text-normal13;

			&:active,
			&:focus {
				border-color: $secondary;
				color: v-bind(inputColor);

				&::placeholder {
					color: transparent;
				}

				& + .base-input-group__content__label {
					visibility: visible;
					top: -12px;
					color: $secondary;
					background-color: v-bind(labelBg);
				}

				& ~ .base-input-group__error {
					display: none;
				}
			}
		}

		&.is-valid .base-input-group__content__label {
			visibility: visible;
			top: -12px;
			background-color: v-bind(labelBg);
		}
	}

	&__error {
		color: $red1;
		font-size: 12px;
		visibility: visible;
		display: block;
		position: absolute;
		right: toRem(5px);
		direction: rtl;

		.base-input:focus ~ & {
			display: none;
		}
	}
}

.base-input {
	display: inline-block;
	border-radius: 6px;
	border: 1px solid $gray6;
	background-color: transparent;
	color: v-bind(inputColor);
	padding: 11px 15px;
	width: 100%;
	outline: 0;
	margin: 0;
	direction: rtl;

	&::placeholder {
		color: $gray6;
		text-align: right;
	}

	&__ltr {
		direction: ltr;
		text-align: left;
	}

	&[type="number"] {
		text-align: left;
		direction: ltr;
	}

	&__error {
		color: $red1;
		border-color: $red1;

		&::placeholder {
			color: $red1;
		}
		label {
			visibility: visible;
			color: $red1;
			top: -12px;
			background-color: v-bind(labelBg);
		}
	}

	&__disabled {
		color: $gray4;
		pointer-events: none;
	}
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

input[type="number"] {
	-moz-appearance: textfield;
}

@each $align in right, left, center {
	.text-#{$align} {
		text-align: #{$align};

		&::placeholder {
			text-align: #{$align};
		}
	}
}
.count-down {
	position: absolute;
	left: toRem(15px);
	top: toRem(12px);
	color: $secondary;
	&_Second {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: toRem(5px);
	}
}
</style>

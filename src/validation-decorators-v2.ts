namespace App {
  //Validation decorator version2
  const titleParameters = { required: true, minLength: 5, maxLength: 30 };
  const descriptionParameters = {
    required: true,
    minLength: 5,
    maxLength: 300,
  };
  const peopleParameters = { required: true, min: 1, max: 10 };
  interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  }

 export function validate2(obj: Validatable) {
    let isValid = true;
    if (obj.required) {
      isValid = isValid && obj.value.toString().trim().length !== 0;
    }
    if (obj.minLength != null && typeof obj.value === "string") {
      isValid = isValid && obj.value.length >= obj.minLength;
    }
    if (obj.maxLength != null && typeof obj.value === "string") {
      isValid = isValid && obj.value.length <= obj.maxLength;
    }
    if (obj.min != null && typeof obj.value === "number") {
      isValid = isValid && obj.value >= obj.min;
    }
    if (obj.max != null && typeof obj.value === "number") {
      isValid = isValid && obj.value <= obj.max;
    }
    return isValid;
  }

 export const validators: Validatable[] = [];

 export function createValidator(obj: any, prop: string) {
    let validatableProp: Validatable = { value: "", required: false };

    if (prop === "title") {
      validatableProp = { value: obj[prop], ...titleParameters } as Validatable;
    }
    if (prop === "description") {
      validatableProp = {
        value: obj[prop],
        ...descriptionParameters,
      } as Validatable;
    }
    if (prop === "people") {
      validatableProp = {
        value: obj[prop],
        ...peopleParameters,
      } as Validatable;
    }

    validators.push(validatableProp);
  }
}
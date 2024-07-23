import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function notOnlyWhiteSpacesValidator(): ValidatorFn {
    return (control: AbstractControl) : ValidationErrors | null => {
        const isWhitespace = (control.value || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { 'onlyWhitespaces': true };
    }
}
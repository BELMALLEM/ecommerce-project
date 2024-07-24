import { FormControl } from '@angular/forms';
import { notOnlyWhiteSpacesValidator } from './shop-form-validators';

describe('notOnlyWhiteSpacesValidator', () => {
  
  it('should return null if control value is not only white spaces', () => {
    // Arrange
    const validator = notOnlyWhiteSpacesValidator();
    const control = new FormControl('valid value');

    // Act
    const result = validator(control);

    // Assert
    expect(result).toBeNull();
  });

  it('should return an error object if control value is only white spaces', () => {
    // Arrange
    const validator = notOnlyWhiteSpacesValidator();
    const control = new FormControl('    '); // Only white spaces

    // Act
    const result = validator(control);

    // Assert
    expect(result).toEqual({ 'onlyWhitespaces': true });
  });

  it('should return null if control value is empty string', () => {
    // Arrange
    const validator = notOnlyWhiteSpacesValidator();
    const control = new FormControl('');

    // Act
    const result = validator(control);

    // Assert
    expect(result).toEqual({ 'onlyWhitespaces': true });
  });

  it('should return null if control value is null or undefined', () => {
    // Arrange
    const validator = notOnlyWhiteSpacesValidator();

    // Act
    const resultNull = validator(new FormControl(null));
    const resultUndefined = validator(new FormControl(undefined));

    // Assert
    expect(resultNull).toEqual({ 'onlyWhitespaces': true });
    expect(resultUndefined).toEqual({ 'onlyWhitespaces': true });
  });

});

import { UserRegisterDto } from './dto';
import LANG from '../lang';

const validateFirstName = (firstName: string = '') => {
  if (firstName?.length < 2) return LANG.USER_FIRST_NAME_ERROR;
};

const validateLastName = (lastName: string = '') => {
  if (lastName?.length < 2) return LANG.USER_LAST_NAME_ERROR;
};

const validateEmailAddress = (emailAddress: string) => {
  if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(emailAddress))
    return LANG.USER_EMAIL_ADDRESS_INVALID_ERROR;
};

const validatePassword = (password: string = '') => {
  let errors = [];
  if (!/[a-z]/.test(password)) errors.push(LANG.USER_PASSWORD_LOWER_CHAR_ERROR);
  if (!/[A-Z]/.test(password)) errors.push(LANG.USER_PASSWORD_UPPER_CHAR_ERROR);
  if (!/\d/.test(password)) errors.push(LANG.USER_PASSWORD_DIGIT_CHAR_ERROR);
  if (!/[-+_!@#$%^&*.,?]/.test(password)) errors.push(LANG.USER_PASSWORD_SPECIAL_CHAR_ERROR);
  if (password?.length < 8) errors.push(LANG.USER_PASSWORD_LENGTH_ERROR);

  return errors;
};

const validateUserRegister = (user: UserRegisterDto) => {
  return {
    firstNameError: validateFirstName(user.firstName),
    lastNameError: validateLastName(user.lastName),
    emailAddressError: validateEmailAddress(user.emailAddress),
    passwordError: validatePassword(user.password),
  };
};
export {
  validateFirstName,
  validateLastName,
  validateEmailAddress,
  validatePassword,
  validateUserRegister,
};

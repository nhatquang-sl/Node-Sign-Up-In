import { UserRegisterDto } from './dto';

const validateFirstName = (firstName: string = '') => {
  if (firstName?.length < 2) return 'First name must be at least 2 characters';
};

const validateLastName = (lastName: string = '') => {
  if (lastName?.length < 2) return 'Last name must be at least 2 characters';
};

const validateEmailAddress = (emailAddress: string) => {
  if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(emailAddress))
    return 'Email address is invalid';
};

const validatePassword = (password: string = '') => {
  let errors = [];
  if (!/[a-z]/.test(password)) errors.push('Password contains at least one lower character');
  if (!/[A-Z]/.test(password)) errors.push('Password contains at least one upper character');
  if (!/\d/.test(password)) errors.push('Password contains at least one digit character');
  if (!/[-+_!@#$%^&*.,?]/.test(password))
    errors.push('Password contains at least one special character');
  if (password?.length < 8) errors.push('Password contains at least 8 characters');

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

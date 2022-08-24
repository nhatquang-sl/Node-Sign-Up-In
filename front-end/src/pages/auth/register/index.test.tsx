import React from 'react';
import { render, screen, fireEvent } from 'test-utils';
import Register from './index';
import LANG from 'shared/lang';

test('show all errors', async () => {
  render(<Register />);
  fireEvent.click(
    screen.getByRole('button', {
      name: 'Submit',
    })
  );

  expect(screen.getByText(LANG.USER_FIRST_NAME_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_LAST_NAME_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_EMAIL_ADDRESS_INVALID_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_LOWER_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_UPPER_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_DIGIT_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_SPECIAL_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_LENGTH_ERROR)).toBeInTheDocument();
});

test('input first name', async () => {
  render(<Register />);
  fireEvent.change(screen.getByLabelText(/First Name/, { selector: 'input' }), {
    target: { value: 'Quang' },
  });

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Submit',
    })
  );

  expect(screen.queryByText(LANG.USER_FIRST_NAME_ERROR)).toBeNull();
  expect(screen.getByText(LANG.USER_LAST_NAME_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_EMAIL_ADDRESS_INVALID_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_LOWER_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_UPPER_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_DIGIT_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_SPECIAL_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_LENGTH_ERROR)).toBeInTheDocument();
});

test('input last name', async () => {
  render(<Register />);
  fireEvent.change(screen.getByLabelText(/Last Name/, { selector: 'input' }), {
    target: { value: 'Nguyen' },
  });

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Submit',
    })
  );

  expect(screen.getByText(LANG.USER_FIRST_NAME_ERROR)).toBeInTheDocument();
  expect(screen.queryByText(LANG.USER_LAST_NAME_ERROR)).toBeNull();
  expect(screen.getByText(LANG.USER_EMAIL_ADDRESS_INVALID_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_LOWER_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_UPPER_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_DIGIT_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_SPECIAL_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_LENGTH_ERROR)).toBeInTheDocument();
});

test('input password number', async () => {
  render(<Register />);
  fireEvent.change(screen.getByLabelText(/Password/, { selector: 'input' }), {
    target: { value: '123' },
  });

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Submit',
    })
  );

  expect(screen.getByText(LANG.USER_FIRST_NAME_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_LAST_NAME_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_EMAIL_ADDRESS_INVALID_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_LOWER_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_UPPER_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.queryByText(LANG.USER_PASSWORD_DIGIT_CHAR_ERROR)).toBeNull();
  expect(screen.getByText(LANG.USER_PASSWORD_SPECIAL_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_LENGTH_ERROR)).toBeInTheDocument();
});

test('input password lower character', async () => {
  render(<Register />);
  fireEvent.change(screen.getByLabelText(/Password/, { selector: 'input' }), {
    target: { value: 'x' },
  });

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Submit',
    })
  );

  expect(screen.getByText(LANG.USER_FIRST_NAME_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_LAST_NAME_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_EMAIL_ADDRESS_INVALID_ERROR)).toBeInTheDocument();
  expect(screen.queryByText(LANG.USER_PASSWORD_LOWER_CHAR_ERROR)).toBeNull();
  expect(screen.getByText(LANG.USER_PASSWORD_UPPER_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_DIGIT_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_SPECIAL_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_LENGTH_ERROR)).toBeInTheDocument();
});

test('input password upper character', async () => {
  render(<Register />);
  fireEvent.change(screen.getByLabelText(/Password/, { selector: 'input' }), {
    target: { value: 'X' },
  });

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Submit',
    })
  );

  expect(screen.getByText(LANG.USER_FIRST_NAME_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_LAST_NAME_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_EMAIL_ADDRESS_INVALID_ERROR)).toBeInTheDocument();
  expect(screen.queryByText(LANG.USER_PASSWORD_LOWER_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.queryByText(LANG.USER_PASSWORD_UPPER_CHAR_ERROR)).toBeNull();
  expect(screen.queryByText(LANG.USER_PASSWORD_DIGIT_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_SPECIAL_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_LENGTH_ERROR)).toBeInTheDocument();
});

test('input password special character', async () => {
  render(<Register />);
  fireEvent.change(screen.getByLabelText(/Password/, { selector: 'input' }), {
    target: { value: '@' },
  });

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Submit',
    })
  );

  expect(screen.getByText(LANG.USER_FIRST_NAME_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_LAST_NAME_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_EMAIL_ADDRESS_INVALID_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_LOWER_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_UPPER_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_DIGIT_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.queryByText(LANG.USER_PASSWORD_SPECIAL_CHAR_ERROR)).toBeNull();
  expect(screen.getByText(LANG.USER_PASSWORD_LENGTH_ERROR)).toBeInTheDocument();
});

test('input password valid', async () => {
  render(<Register />);
  fireEvent.change(screen.getByLabelText(/Password/, { selector: 'input' }), {
    target: { value: '123456x@X' },
  });

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Submit',
    })
  );

  expect(screen.getByText(LANG.USER_FIRST_NAME_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_LAST_NAME_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_EMAIL_ADDRESS_INVALID_ERROR)).toBeInTheDocument();
  expect(screen.queryByText(LANG.USER_PASSWORD_LOWER_CHAR_ERROR)).toBeNull();
  expect(screen.queryByText(LANG.USER_PASSWORD_UPPER_CHAR_ERROR)).toBeNull();
  expect(screen.queryByText(LANG.USER_PASSWORD_DIGIT_CHAR_ERROR)).toBeNull();
  expect(screen.queryByText(LANG.USER_PASSWORD_SPECIAL_CHAR_ERROR)).toBeNull();
  expect(screen.queryByText(LANG.USER_PASSWORD_LENGTH_ERROR)).toBeNull();
});

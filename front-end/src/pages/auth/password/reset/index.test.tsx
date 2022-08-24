import LANG from 'shared/lang';
import { render, screen, fireEvent } from 'test-utils';
import ResetPassword from './index';

test('show all errors', async () => {
  render(<ResetPassword />);
  fireEvent.click(
    screen.getByRole('button', {
      name: 'Submit',
    })
  );

  expect(screen.getByText(LANG.USER_PASSWORD_LOWER_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_UPPER_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_DIGIT_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_SPECIAL_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_LENGTH_ERROR)).toBeInTheDocument();
});

test('input password number', async () => {
  render(<ResetPassword />);
  fireEvent.change(screen.getByLabelText(/Password/, { selector: 'input' }), {
    target: { value: '123' },
  });

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Submit',
    })
  );

  expect(screen.getByText(LANG.USER_PASSWORD_LOWER_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_UPPER_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.queryByText(LANG.USER_PASSWORD_DIGIT_CHAR_ERROR)).toBeNull();
  expect(screen.getByText(LANG.USER_PASSWORD_SPECIAL_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_LENGTH_ERROR)).toBeInTheDocument();
});

test('input password lower character', async () => {
  render(<ResetPassword />);
  fireEvent.change(screen.getByLabelText(/Password/, { selector: 'input' }), {
    target: { value: 'x' },
  });

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Submit',
    })
  );

  expect(screen.queryByText(LANG.USER_PASSWORD_LOWER_CHAR_ERROR)).toBeNull();
  expect(screen.getByText(LANG.USER_PASSWORD_UPPER_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_DIGIT_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_SPECIAL_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_LENGTH_ERROR)).toBeInTheDocument();
});

test('input password upper character', async () => {
  render(<ResetPassword />);
  fireEvent.change(screen.getByLabelText(/Password/, { selector: 'input' }), {
    target: { value: 'X' },
  });

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Submit',
    })
  );

  expect(screen.queryByText(LANG.USER_PASSWORD_LOWER_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.queryByText(LANG.USER_PASSWORD_UPPER_CHAR_ERROR)).toBeNull();
  expect(screen.queryByText(LANG.USER_PASSWORD_DIGIT_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_SPECIAL_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_LENGTH_ERROR)).toBeInTheDocument();
});

test('input password special character', async () => {
  render(<ResetPassword />);
  fireEvent.change(screen.getByLabelText(/Password/, { selector: 'input' }), {
    target: { value: '@' },
  });

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Submit',
    })
  );

  expect(screen.getByText(LANG.USER_PASSWORD_LOWER_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_UPPER_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_DIGIT_CHAR_ERROR)).toBeInTheDocument();
  expect(screen.queryByText(LANG.USER_PASSWORD_SPECIAL_CHAR_ERROR)).toBeNull();
  expect(screen.getByText(LANG.USER_PASSWORD_LENGTH_ERROR)).toBeInTheDocument();
});

test('input password valid', async () => {
  render(<ResetPassword />);
  fireEvent.change(screen.getByLabelText(/Password/, { selector: 'input' }), {
    target: { value: '123456x@X' },
  });

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Submit',
    })
  );

  expect(screen.queryByText(LANG.USER_PASSWORD_LOWER_CHAR_ERROR)).toBeNull();
  expect(screen.queryByText(LANG.USER_PASSWORD_UPPER_CHAR_ERROR)).toBeNull();
  expect(screen.queryByText(LANG.USER_PASSWORD_DIGIT_CHAR_ERROR)).toBeNull();
  expect(screen.queryByText(LANG.USER_PASSWORD_SPECIAL_CHAR_ERROR)).toBeNull();
  expect(screen.queryByText(LANG.USER_PASSWORD_LENGTH_ERROR)).toBeNull();
});

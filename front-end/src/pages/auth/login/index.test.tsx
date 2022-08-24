import LANG from 'shared/lang';
import { render, screen, fireEvent } from 'test-utils';
import Login from './index';

test('show all errors', async () => {
  render(<Login />);
  fireEvent.click(
    screen.getByRole('button', {
      name: 'Submit',
    })
  );

  expect(screen.getByText(LANG.USER_EMAIL_ADDRESS_INVALID_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_MISSING_ERROR)).toBeInTheDocument();
  expect(screen.getByText('Forgot password?')).toBeInTheDocument();
  expect(screen.getByText("Don't have an account? Sign Up")).toBeInTheDocument();
});

test('input email address invalid', async () => {
  render(<Login />);
  fireEvent.change(screen.getByLabelText(/Email Address/, { selector: 'input' }), {
    target: { value: 'Quang' },
  });

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Submit',
    })
  );

  expect(screen.getByText(LANG.USER_EMAIL_ADDRESS_INVALID_ERROR)).toBeInTheDocument();
  expect(screen.getByText(LANG.USER_PASSWORD_MISSING_ERROR)).toBeInTheDocument();
});

test('input email address valid', async () => {
  render(<Login />);
  fireEvent.change(screen.getByLabelText(/Email Address/, { selector: 'input' }), {
    target: { value: 'sunligh01@gmail.com' },
  });

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Submit',
    })
  );

  expect(screen.queryByText(LANG.USER_EMAIL_ADDRESS_INVALID_ERROR)).toBeNull();
  expect(screen.getByText(LANG.USER_PASSWORD_MISSING_ERROR)).toBeInTheDocument();
});

test('input email address password valid', async () => {
  render(<Login />);
  fireEvent.change(screen.getByLabelText(/Email Address/, { selector: 'input' }), {
    target: { value: 'sunligh01@gmail.com' },
  });

  fireEvent.change(screen.getByLabelText(/Password/, { selector: 'input' }), {
    target: { value: 'P@ssw0rd' },
  });

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Submit',
    })
  );

  expect(screen.queryByText(LANG.USER_EMAIL_ADDRESS_INVALID_ERROR)).toBeNull();
  expect(screen.queryByText(LANG.USER_PASSWORD_MISSING_ERROR)).toBeNull();
});

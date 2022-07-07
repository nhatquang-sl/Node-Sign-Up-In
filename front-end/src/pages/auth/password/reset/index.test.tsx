import { render, screen, fireEvent } from 'test-utils';
import ResetPassword from './index';

test('show all errors', async () => {
  render(<ResetPassword />);
  fireEvent.click(
    screen.getByRole('button', {
      name: 'Submit',
    })
  );

  expect(screen.getByText('Password contains at least one lower character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one upper character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one digit character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one special character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least 8 characters')).toBeInTheDocument();
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

  expect(screen.getByText('Password contains at least one lower character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one upper character')).toBeInTheDocument();
  expect(screen.queryByText('Password contains at least one digit character')).toBeNull();
  expect(screen.getByText('Password contains at least one special character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least 8 characters')).toBeInTheDocument();
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

  expect(screen.queryByText('Password contains at least one lower character')).toBeNull();
  expect(screen.getByText('Password contains at least one upper character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one digit character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one special character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least 8 characters')).toBeInTheDocument();
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

  expect(screen.queryByText('Password contains at least one lower character')).toBeInTheDocument();
  expect(screen.queryByText('Password contains at least one upper character')).toBeNull();
  expect(screen.queryByText('Password contains at least one digit character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one special character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least 8 characters')).toBeInTheDocument();
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

  expect(screen.getByText('Password contains at least one lower character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one upper character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one digit character')).toBeInTheDocument();
  expect(screen.queryByText('Password contains at least one special character')).toBeNull();
  expect(screen.getByText('Password contains at least 8 characters')).toBeInTheDocument();
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

  expect(screen.queryByText('Password contains at least one lower character')).toBeNull();
  expect(screen.queryByText('Password contains at least one upper character')).toBeNull();
  expect(screen.queryByText('Password contains at least one digit character')).toBeNull();
  expect(screen.queryByText('Password contains at least one special character')).toBeNull();
  expect(screen.queryByText('Password contains at least 8 characters')).toBeNull();
});

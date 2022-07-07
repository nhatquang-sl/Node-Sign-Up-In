import React from 'react';
import { render, screen, fireEvent } from 'test-utils';
import Login from './index';

test('show all errors', async () => {
  render(<Login />);
  fireEvent.click(
    screen.getByRole('button', {
      name: 'Submit',
    })
  );

  expect(screen.getByText('Email address is invalid')).toBeInTheDocument();
  expect(screen.getByText('Password is required')).toBeInTheDocument();
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

  expect(screen.getByText('Email address is invalid')).toBeInTheDocument();
  expect(screen.getByText('Password is required')).toBeInTheDocument();
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

  expect(screen.queryByText('Email address is invalid')).toBeNull();
  expect(screen.getByText('Password is required')).toBeInTheDocument();
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

  expect(screen.queryByText('Email address is invalid')).toBeNull();
  expect(screen.queryByText('Password is required')).toBeNull();
});

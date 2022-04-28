import React from 'react';
import { render, screen, fireEvent } from 'test-utils';
import Register from './index';

test('show all errors', async () => {
  render(<Register />);
  fireEvent.click(
    screen.getByRole('button', {
      name: 'Sign Up',
    })
  );

  expect(screen.getByText('First name must be at least 2 characters')).toBeInTheDocument();
  expect(screen.getByText('Last name must be at least 2 characters')).toBeInTheDocument();
  expect(screen.getByText('Email address is invalid')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one lower character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one upper character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one digit character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one special character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least 8 characters')).toBeInTheDocument();
});

test('input first name', async () => {
  render(<Register />);
  fireEvent.change(screen.getByLabelText(/First Name/, { selector: 'input' }), {
    target: { value: 'Quang' },
  });

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Sign Up',
    })
  );

  expect(screen.queryByText('First name must be at least 2 characters')).toBeNull();
  expect(screen.getByText('Last name must be at least 2 characters')).toBeInTheDocument();
  expect(screen.getByText('Email address is invalid')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one lower character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one upper character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one digit character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one special character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least 8 characters')).toBeInTheDocument();
});

test('input last name', async () => {
  render(<Register />);
  fireEvent.change(screen.getByLabelText(/Last Name/, { selector: 'input' }), {
    target: { value: 'Nguyen' },
  });

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Sign Up',
    })
  );

  expect(screen.getByText('First name must be at least 2 characters')).toBeInTheDocument();
  expect(screen.queryByText('Last name must be at least 2 characters')).toBeNull();
  expect(screen.getByText('Email address is invalid')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one lower character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one upper character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one digit character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one special character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least 8 characters')).toBeInTheDocument();
});

test('input password number', async () => {
  render(<Register />);
  fireEvent.change(screen.getByLabelText(/Password/, { selector: 'input' }), {
    target: { value: '123' },
  });

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Sign Up',
    })
  );

  expect(screen.getByText('First name must be at least 2 characters')).toBeInTheDocument();
  expect(screen.getByText('Last name must be at least 2 characters')).toBeInTheDocument();
  expect(screen.getByText('Email address is invalid')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one lower character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one upper character')).toBeInTheDocument();
  expect(screen.queryByText('Password contains at least one digit character')).toBeNull();
  expect(screen.getByText('Password contains at least one special character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least 8 characters')).toBeInTheDocument();
});

test('input password lower character', async () => {
  render(<Register />);
  fireEvent.change(screen.getByLabelText(/Password/, { selector: 'input' }), {
    target: { value: 'x' },
  });

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Sign Up',
    })
  );

  expect(screen.getByText('First name must be at least 2 characters')).toBeInTheDocument();
  expect(screen.getByText('Last name must be at least 2 characters')).toBeInTheDocument();
  expect(screen.getByText('Email address is invalid')).toBeInTheDocument();
  expect(screen.queryByText('Password contains at least one lower character')).toBeNull();
  expect(screen.getByText('Password contains at least one upper character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one digit character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one special character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least 8 characters')).toBeInTheDocument();
});

test('input password upper character', async () => {
  render(<Register />);
  fireEvent.change(screen.getByLabelText(/Password/, { selector: 'input' }), {
    target: { value: 'X' },
  });

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Sign Up',
    })
  );

  expect(screen.getByText('First name must be at least 2 characters')).toBeInTheDocument();
  expect(screen.getByText('Last name must be at least 2 characters')).toBeInTheDocument();
  expect(screen.getByText('Email address is invalid')).toBeInTheDocument();
  expect(screen.queryByText('Password contains at least one lower character')).toBeInTheDocument();
  expect(screen.queryByText('Password contains at least one upper character')).toBeNull();
  expect(screen.queryByText('Password contains at least one digit character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one special character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least 8 characters')).toBeInTheDocument();
});

test('input password special character', async () => {
  render(<Register />);
  fireEvent.change(screen.getByLabelText(/Password/, { selector: 'input' }), {
    target: { value: '@' },
  });

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Sign Up',
    })
  );

  expect(screen.getByText('First name must be at least 2 characters')).toBeInTheDocument();
  expect(screen.getByText('Last name must be at least 2 characters')).toBeInTheDocument();
  expect(screen.getByText('Email address is invalid')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one lower character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one upper character')).toBeInTheDocument();
  expect(screen.getByText('Password contains at least one digit character')).toBeInTheDocument();
  expect(screen.queryByText('Password contains at least one special character')).toBeNull();
  expect(screen.getByText('Password contains at least 8 characters')).toBeInTheDocument();
});

test('input password valid', async () => {
  render(<Register />);
  fireEvent.change(screen.getByLabelText(/Password/, { selector: 'input' }), {
    target: { value: '123456x@X' },
  });

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Sign Up',
    })
  );

  expect(screen.getByText('First name must be at least 2 characters')).toBeInTheDocument();
  expect(screen.getByText('Last name must be at least 2 characters')).toBeInTheDocument();
  expect(screen.getByText('Email address is invalid')).toBeInTheDocument();
  expect(screen.queryByText('Password contains at least one lower character')).toBeNull();
  expect(screen.queryByText('Password contains at least one upper character')).toBeNull();
  expect(screen.queryByText('Password contains at least one digit character')).toBeNull();
  expect(screen.queryByText('Password contains at least one special character')).toBeNull();
  expect(screen.queryByText('Password contains at least 8 characters')).toBeNull();
});

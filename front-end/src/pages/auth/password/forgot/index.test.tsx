import { render, screen, fireEvent } from 'test-utils';
import Register from './index';

test('show all errors', async () => {
  render(<Register />);
  fireEvent.click(
    screen.getByRole('button', {
      name: 'Submit',
    })
  );

  expect(screen.getByText('Email address is invalid')).toBeInTheDocument();
});

test('input email address invalid', async () => {
  render(<Register />);
  fireEvent.change(screen.getByLabelText(/Email Address/, { selector: 'input' }), {
    target: { value: 'email_invalid' },
  });

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Submit',
    })
  );

  expect(screen.getByText('Email address is invalid')).toBeInTheDocument();
});

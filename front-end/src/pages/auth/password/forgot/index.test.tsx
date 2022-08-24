import { render, screen, fireEvent } from 'test-utils';
import LANG from 'shared/lang';
import Register from './index';

test('show all errors', async () => {
  render(<Register />);
  fireEvent.click(
    screen.getByRole('button', {
      name: 'Submit',
    })
  );

  expect(screen.getByText(LANG.USER_EMAIL_ADDRESS_INVALID_ERROR)).toBeInTheDocument();
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

  expect(screen.getByText(LANG.USER_EMAIL_ADDRESS_INVALID_ERROR)).toBeInTheDocument();
});

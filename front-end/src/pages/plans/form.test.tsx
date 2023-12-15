import LANG from 'shared/lang';
import { render, screen, fireEvent } from 'test-utils';
import Plans from './index';

test('show all errors', async () => {
  render(<Plans />);

  fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

  expect(
    await screen.findByText(`${LANG.GRID_PLAN_LOWER_PRICE_GT_ERROR} ${0}`)
  ).toBeInTheDocument();
  expect(
    await screen.findByText(`${LANG.GRID_PLAN_UPPER_PRICE_GT_ERROR} ${0}`)
  ).toBeInTheDocument();
  expect(await screen.findByText(`${LANG.GRID_PLAN_GRID_GTE_ERROR} ${1}`)).toBeInTheDocument();
  expect(
    await screen.findByText(`${LANG.GRID_PLAN_INVESTMENT_GTE_ERROR} ${5}`)
  ).toBeInTheDocument();
});

test('show all errors', async () => {
  render(<Plans />);

  fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

  expect(
    await screen.findByText(`${LANG.GRID_PLAN_LOWER_PRICE_GT_ERROR} ${0}`)
  ).toBeInTheDocument();
  expect(
    await screen.findByText(`${LANG.GRID_PLAN_UPPER_PRICE_GT_ERROR} ${0}`)
  ).toBeInTheDocument();
  expect(await screen.findByText(`${LANG.GRID_PLAN_GRID_GTE_ERROR} ${1}`)).toBeInTheDocument();
  expect(
    await screen.findByText(`${LANG.GRID_PLAN_INVESTMENT_GTE_ERROR} ${5}`)
  ).toBeInTheDocument();
});

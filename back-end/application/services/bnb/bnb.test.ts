import bnbService from '.';

test('get server time', async () => {
  const startedTime = new Date().getTime();
  const serverTime = await bnbService.getServerTime();

  expect(serverTime).toBeGreaterThan(startedTime);
  expect(serverTime).toBeLessThan(new Date().getTime());
});

test('get klines', async () => {
  const klines = await bnbService.getKlines('NEARUSDT', '5m');

  expect(klines.length).toEqual(1000);
});

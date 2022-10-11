import bnbService from '.';

test('activation code missing', async () => {
  const serverTime = await bnbService.getServerTime();
  console.log({ serverTime });
});

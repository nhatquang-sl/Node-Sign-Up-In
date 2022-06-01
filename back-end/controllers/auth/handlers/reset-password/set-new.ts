import User from '@database/models/user';
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const handleSetNew = async (emailAddress: string) => {
  const user = await User.findOne({
    where: { emailAddress },
  });
  await delay(2000);
  return { lastDate: new Date().getTime() };
};

export default handleSetNew;

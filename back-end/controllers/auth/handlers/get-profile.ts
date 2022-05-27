import User from '@database/models/user';

const handleGetProfile = async (userId: number) => {
  const user = await User.findOne({
    where: { id: userId },
  });

  return user ? User.getAuthDto(user, '') : null;
};

export default handleGetProfile;

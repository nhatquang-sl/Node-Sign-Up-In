import User from '@database/models/user';
import { sendActivateEmail } from '../utils';
import { UserDto } from '@libs/user/dto';

const handleSendActivateLink = async (userId: number) => {
  // https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findone
  const user = await User.findOne({ where: { id: userId } });

  if (user != null) await sendActivateEmail(user as UserDto, user.securityStamp);
};

export default handleSendActivateLink;

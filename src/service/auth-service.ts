/**
 * controller implementation class
 */
import * as JWT from 'jsonwebtoken';
import { getManager } from 'typeorm';
import { UserInfo } from '../entity/UserInfo';
import { JWT_SECRET } from '../constants';
export default class AuthService {
  /**
   * Search the database based on the user name and password
   * return the user information and JWT Token token if matched
   */
  auth = async ctx => {
    const userInfo = ctx.request.body;
    const uId = userInfo.uId;
    const password = userInfo.password;
    const userRepository = getManager().getRepository(UserInfo);
    const users = await userRepository.findOne({
      uId: uId,
      password: password
    });
    if (users) {
      const result = {
        userInfo: users,
        token: JWT.sign({ id: uId }, JWT_SECRET, { expiresIn: 24 * 60 * 60 })
      };
      ctx.success(result, 'success');
    } else {
      ctx.fail('Incorrect user name or password！', -1);
    }
  };
}

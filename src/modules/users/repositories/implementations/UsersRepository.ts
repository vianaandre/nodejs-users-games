import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    return await this.repository.findOneOrFail({
      relations: ['games'],
      where: {
        id: user_id,
      }
    });
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return await await this.repository.query(`
      SELECT 
        *
      FROM users
      ORDER BY first_name ASC;
    `);
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return await this.repository.query(`
      SELECT 
        * 
      FROM users
      WHERE 
        first_name ILIKE $1
        AND
        last_name ILIKE $2
    `, [first_name, last_name]);
  }
}

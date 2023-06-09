import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { IUser } from '../interfaces/Users';

export default class UserModel {
  connection: Pool;

  constructor(connection : Pool) {
    this.connection = connection;
  }

  async createNewUser(
    username: string, 
    vocation: string, 
    level: number, 
    password: string,
  ): Promise<IUser> {
    const [{ insertId }] = await this.connection.execute<ResultSetHeader>(
      'INSERT INTO Trybesmith.users(username, vocation, level, password) VALUES(?, ?, ?, ?)',
      [username, vocation, level, password],
    );

    const newUser = {
      id: insertId,
      username, 
      vocation, 
      level, 
      password,
    };

    return newUser;
  }

  async getUserByName(username: string): Promise<IUser | undefined> {
    const [rows] = await this.connection.execute<(
    RowDataPacket & IUser)[]>(
      'SELECT id FROM  Trybesmith.users  WHERE username = ?;', 
      [username],
      );

    return rows[0];
  }
}

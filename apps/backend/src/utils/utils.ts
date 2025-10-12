// External libraries
import * as bcrypt from 'bcrypt';

export class Utils {
  /**
   * Generate hash from string provided
   *
   * @param beforeHash String to be hashed
   * @returns Hashed string
   */
  static async generateHash(beforeHash: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(beforeHash, salt);
  }

  static createCookie(
    cookieName: string,
    content: string,
    age: string,
    httpOnly?: boolean,
    domain?: string,
    path = '/',
  ): string {
    const cookieArr = [`${cookieName}=${content}`, `Max-Age=${age}`, `Path=${path}`];
    if (domain) cookieArr.push(`Domain=${domain}`);
    if (httpOnly) cookieArr.push('HttpOnly');

    return `${cookieArr.join(';')};`;
  }
}

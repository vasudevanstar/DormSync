// services/authService.ts
import { Role } from '../types';

// Hard-coded dataset for users
const users = {
  [Role.RESIDENT]: [
    { id: 'Barani', password: '123456' },
    { id: 'Anant Gopal', password: '123456' },
  ],
  [Role.WARDEN]: [
    { id: 'Sadiyya', password: '123456' },
  ],
  [Role.TECHNICIAN]: [
    { id: 'Pradeep', password: '123456' },
    { id: 'Vishnu', password: '123456' },
  ],
};

/**
 * Simulates an API call to authenticate a user.
 * @param role The role of the user trying to log in.
 * @param id The user's ID.
 * @param password The user's password.
 * @returns A promise that resolves to true if authentication is successful, false otherwise.
 */
export const authenticateUser = (role: Role, id: string, password: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const userList = users[role];
      const foundUser = userList.find(user => user.id === id && user.password === password);
      resolve(!!foundUser);
    }, 1000); // 1-second delay
  });
};

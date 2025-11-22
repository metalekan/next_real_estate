export type UserRole = 'user' | 'agent' | 'admin';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserResponse {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
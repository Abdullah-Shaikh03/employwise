import { ObjectId } from "mongoose";

export interface IUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ILoginRes {
  token: string;
}

export interface IUserListRes {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: IUser[];
}

export interface IUpdateUserPL {
  first_name: string;
  last_name: string;
  email: string;
}

export interface UpdateUserResponse {
  updatedAt: string;
}

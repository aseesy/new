import {VERIFICATION_TYPE} from './enums';

export interface IBaseResponse {
  isValid: boolean;
  message: string;
}

export interface IGenericResponse<T> extends IBaseResponse {
  result: T;
}

// Generic pagination response
export interface IGenericPaginationResponse<T> extends IBaseResponse {
  result: {
    total: number;
    result: T;
  };
}
export interface ISendVerification {
  name: string;
  value: string;
  type: VERIFICATION_TYPE;
}

export interface IMatchIdPayload {
  userMatchId: string;
  connectionMatchID: string;
}

export interface IVerificationResponse {
  verificationCode: number;
}

export interface IMatchUsersResponse {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface IRecentResponse {
  content: string;
  receiverId: number;
  senderId: number;
  timeStamp: string;
}

export interface IMessageResponse {
  message: string;
  receiverId: number;
  senderId: number;
  timeStamp: string;
}

export interface ILoginResponse {
  access_token: string;
  refresh_token: string;
  uniqueId: string;
  expires_in: number;
}

export interface IRegisterPayload {
  userName: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  roleId?: 1;
}

export interface ILoginPayload {
  userName: string;
  password: string;
}

export interface IChatPayload {
    pageSize?: number,
    pageNumber: number,
    receiverId: number,
    senderId: number,
}
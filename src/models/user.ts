export interface IUser {
    createdDate: string
    email: string
    firstName: string
    isActive: boolean
    lastName: string
    modifiedDate: string
    password: string
    phoneNumber: string
    roleId: number
    roles: any
    uniqueMatchID: string
    userId: number
    userName: string
    addressLine1?: string;
    addressLine2?: string;
    state?: string;
    pinCode?: string;
    country?: string;
  }
  
  export interface IUserUpdatePayload {
    id?: number
    userName?: string
    email: string
    firstName: string
    lastName: string
    phoneNumber: string
    roleId?: number
    addressLine1?: string;
    addressLine2?: string;
    state?: string;
    pinCode?: string;
    country?: string;
  }
  
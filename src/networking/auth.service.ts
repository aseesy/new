// /api/notification/send-verification

import { QueryKey } from "react-query";
import { IGenericPaginationResponse, IGenericResponse, ILoginPayload, ILoginResponse, IMatchIdPayload, IMatchUsersResponse, IMessageResponse, IRecentResponse, IRegisterPayload, ISendVerification, IVerificationResponse } from "../models/common"
import CoreApi from "./core"

export const login = async (payload: ILoginPayload): Promise<ILoginResponse> => {
    const response = await CoreApi.post('/api/auth/login', payload);
    return response.data;
}

export const register = async (payload: IRegisterPayload): Promise<IVerificationResponse> => {
    const response = await CoreApi.post('/api/users/register', payload);
    return response.data;
}

export const sentOtp = async (payload: ISendVerification): Promise<IGenericResponse<IVerificationResponse>> => {
    const response = await CoreApi.post('/api/notification/send-verification', payload);
    return response.data;
}

export const matchUserByID = async (payload: IMatchIdPayload): Promise<IGenericResponse<IVerificationResponse>> => {
    const response = await CoreApi.post(
        `/api/connections/connection?userMatchId=${payload.userMatchId}&connectionMatchID=${payload.connectionMatchID}`, 
        {}
    );
    return response.data;
};

export const getUsersByID = async (payload: Omit<IMatchIdPayload, 'connectionMatchID'>): Promise<IGenericResponse<IMatchUsersResponse[]>> => {
    const response = await CoreApi.get(
        `/api/connections/connectionsbyId?userMatchId=${payload.userMatchId}`
    );
    return response.data;
};

export const getMyConnections = async (receiverId: number): Promise<IGenericResponse<IRecentResponse[]>> => {
    const response = await CoreApi.get(
        `/api/chat/mostRecentMessages?userId=${receiverId}`
    );
    return response.data;
};

// export const getChats = async ({ queryKey }: {queryKey: QueryKey}): Promise<IGenericResponse<IMessageResponse[]>> => {
//     const payload = { pageNumber: 1, receiverId: queryKey[1], senderId: queryKey[2], pageSize: 500  } as IChatPayload;
//     const response = await CoreApi.post(
//         `/api/chat/chatbyId`, payload
//     );
//     return response.data;
// };

export const getChats = async ({ pageParam = 1, queryKey }: {pageParam: number, queryKey: QueryKey}): Promise<IGenericPaginationResponse<IMessageResponse[]>> => {
    const payload = { pageNumber: pageParam, receiverId: queryKey[1], senderId: queryKey[2], pageSize: 50  };
    const response = await CoreApi.post(
        `/api/chat/chatbyId`, payload
    );
    return response.data;
};

export const sendOtpForResetPassword = async (payload: {email: string}): Promise<IGenericResponse<IVerificationResponse>> => {
    const response = await CoreApi.get(`/api/notification/send-reset-password?email=${payload.email}`);
    return response.data;
}

export const resetPassword = async (payload: {username: string, password: string}): Promise<IGenericResponse<void>> => {
    const response = await CoreApi.put(`/api/users/updatePassword`, payload);
    return response.data;
}
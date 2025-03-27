import { IGenericResponse } from "../models/common";
import { IUser, IUserUpdatePayload } from "../models/user";
import CoreApi from "./core";

export const getUserInfoById = async (id: number): Promise<IGenericResponse<IUser>> => {
    const response = await CoreApi.get(`/api/users/${id}`);
    return response.data;
}

export const uploadUserImage = async (payload: {userId: number, imageBinary: string}): Promise<IGenericResponse<{fileUrl: string}>> => {
    const response = await CoreApi.post(`/api/users/uploadProfileImage`, payload);
    return response.data;
}

export const updateUserProfile = async (payload: IUserUpdatePayload): Promise<IGenericResponse<{fileUrl: string}>> => {
    const response = await CoreApi.put(`/api/users/update?id=${payload?.id}`, payload);
    return response.data;
}
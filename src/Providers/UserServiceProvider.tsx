import { createContext, useContext } from "react";
import { IUser } from "../models/user";
import { BLOB_PATH } from "../constants/config";
import { getFromLoggedInUser } from "../utils";

interface IUserContext {
    user?: IUser;
    profile_photo: string;
    setUser: (user: IUser) => void;
    refreshProfilePhoto: () => void;
}

const UserContext = createContext<IUserContext | undefined>(undefined)
const UserServiceProvider = ({children}: {children: React.ReactNode}) => {
    const userId = getFromLoggedInUser('certserialnumber');
    const userService: IUserContext  = {
        profile_photo: `${BLOB_PATH}${userId}.jpeg?`,
        setUser: (user: IUser) => {
            userService.user = user;
        },
        refreshProfilePhoto: () => {
            const randomNumber = Math.random();
            userService.profile_photo = `${BLOB_PATH}${userId}.jpeg?id=${randomNumber}`;
        }
    }
    
    return (
        <UserContext.Provider value={userService}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = (): IUserContext => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('User must be used within a UserServiceProvider');
  }
  return context;
};

export default UserServiceProvider;
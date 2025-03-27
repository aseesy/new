import Splash from "../components/common/Splash";
import ForgetPassword from "../screens/Auth/ForgetPassword";
import Intro from "../screens/Auth/Intro";
import Login from "../screens/Auth/Login";
import OtpVerification from "../screens/Auth/OtpVerification";
import Register from "../screens/Auth/Register";
import RegisterForm from "../screens/Auth/RegisterForm";
import RegisterPhone from "../screens/Auth/RegisterPhone";
import SetNewPassword from "../screens/Auth/SetNewPassword";
import Welcome from "../screens/Auth/Welcome";
import Web from "../screens/Common/Web";
import Calander from "../screens/Protected/Calander";
import Connection from "../screens/Protected/Connection";
import Invite from "../screens/Protected/Invite";
import Match from "../screens/Protected/Match";
import MatchId from "../screens/Protected/MatchId";
import Messages from "../screens/Protected/Messages";
import ChatWindow from "../screens/Protected/Messages/ChatWindow";
import NewChat from "../screens/Protected/Messages/NewChat";
import Profile from "../screens/Protected/Profile";
import EditProfile from "../screens/Protected/Profile/editProfile";
import { DrawerStack } from "./Drawer";

export const routesWithTitle = [
    {name: '/messages/index', component: Messages, title: 'Secure Messages' },
    {name: '/messages/newChat', component: NewChat, title: 'Create New Message' },
    {name: '/messages/chat', component: ChatWindow, title: '' },
    {name: '/family/index', component: Connection, title: 'Family' },
    {name: '/profile/index', component: Profile, title: 'Profile' },
    {name: '/profile/editProfile', component: EditProfile, title: 'Edit Profile' },
] as const;

export const TabRoutes = [
    {name: '/connection', component: Connection, icon: 'heart', label: 'Family' },
    {name: '/messages', component: Messages, icon: 'message', label: 'Messages' },
    {name: '/calendar', component: Calander, icon: 'calendar-days', label: 'Calendar' },
] as const;

export const Routes = [
    {name: '/splash', component: Splash },
    {name: '/intro', component: Intro },
    {name: '/webview', component: Web },
    {name: '/welcome', component: Welcome },
    {name: '/login', component: Login },
    {name: '/forget-password', component: ForgetPassword},
    {name: '/set-new-password', component: SetNewPassword},
    {name: '/register', component: Register },
    {name: '/otpVerification', component: OtpVerification },
    {name: '/registerForm', component: RegisterForm },
    {name: '/registerPhone', component: RegisterPhone },
    {name: '/match', component: Match },
    {name: '/invite', component: Invite },
    {name: '/matchId', component: MatchId },
    {name: '/home', component: DrawerStack},
    ...routesWithTitle,
] as const;

export type RouteName = typeof Routes[number]['name'] | typeof TabRoutes[number]['name'];

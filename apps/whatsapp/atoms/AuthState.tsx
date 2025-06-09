import { atom } from "recoil";

export const AuthState = atom({
    key: 'AuthState',
    default: {username: '', email: '', password: ''}
})
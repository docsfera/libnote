import React from "react"
import {
    Routes,
    Route,
    NavLink,
    useNavigate,
} from 'react-router-dom';
import PdfAside from "./components/PdfAside/PdfAside";

export const AuthContext = React.createContext<any>(null)

type UserType = {
    id: string | null
    mail: string | null
    token: string | null
}


const AuthProvider = ({ children }: any) => {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = React.useState<UserType>({id: null, mail: null, token: null})
    const fakeAuth = () =>
        new Promise((resolve) => {
            setTimeout(() => resolve('2342f2f1d131rf12'), 250);
        });

    const handleLogin = async (user: UserType) => {
        //const token = await fakeAuth();
        console.log({user})
        //@ts-ignore
        setUserInfo({id: user.id, mail: user.mail, token: user.token})
        navigate('/')
    };

    const handleLogout = () => {
        setUserInfo({id: null, mail: null, token: null})
    };

    const redirectToAuth = () => {
        navigate('/auth')
    }

    const value = {
        userInfo,
        onLogin: handleLogin,
        onLogout: handleLogout,
        redirectToAuth,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
export default AuthProvider
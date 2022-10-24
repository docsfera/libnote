import React, {useState} from 'react';
import {AuthContext} from "../../AuthProvider"
import "./Auth.scss"
import {gql, useMutation} from "@apollo/client"

const CREATE_USER = gql`
    mutation createUser($input: UserInput) {
        createUser(input: $input){
            id
            mail
        }
    }
`

const Auth = () => {

    const [createUser] = useMutation(CREATE_USER)
    const [userName, setUserName] = useState("")
    const [userPassword, setUserPassword] = useState("")

    const token = React.useContext(AuthContext)
    console.log({token})

    const loginEvent = async () => {
        await createUser({variables: {input: {mail: userName, password: userPassword}}})
            .then((res) => {console.log(res.data.createUser.id);
            token.onLogin({
                id: res.data.createUser.id,
                mail: res.data.createUser.mail,
                token: "token"
            })})
            .catch(() => alert("Что-то пошло не так"))
    }



    return (
        <div className="auth">
            <div className="auth-image"> </div>
            <div className="auth-container">
                <div className="auth-inputs">
                    <p className="name-section">Регистрация</p>
                    <div className="input-section">
                        <p className="name-input">Имя пользователя</p>
                        <input className="input" type="text" placeholder="Введите логин" value={userName} onChange={(e) => setUserName(e.target.value)}/>
                    </div>

                    <div className="input-section">
                        <p className="name-input">Пароль</p>
                        <input className="input" type="password" placeholder="Введите пароль" value={userPassword} onChange={(e) => setUserPassword(e.target.value)}/>
                    </div>

                    <div className="input-section">
                        <p className="name-input">Подтвердить пароль</p>
                        <input className="input" placeholder="Подтвердите пароль" type="password"/>
                    </div>

                    <button className="create-account" onClick={loginEvent}>Создать аккаунт</button>

                </div>
            </div>
            {/*<input type="text" className="input-login"/>*/}
            {/*<input type="password" className="input-password"/>*/}
            {/*<button className="login" onClick={loginEvent}>login</button>*/}
        </div>
    );
};

export default Auth;
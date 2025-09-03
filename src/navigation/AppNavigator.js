import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";


export default function AppNavigator() {

    const [isSignedIn, setIsSginedIn] = useState(false);

    const handleLogin = ({username, password}) => {
        if (!username) {
            console.log("empty username")
            return false;
        }
        if (!password) {
            console.log("empty password");
            return false;
        }

        console.log("login success");
        setIsSginedIn(true);
        return true
    }

    return (
        <NavigationContainer>
            {
                isSignedIn ? (<AppStack/>) : (<AuthStack onLoginSuccess={handleLogin} />)
            }
        </NavigationContainer>
    )
}
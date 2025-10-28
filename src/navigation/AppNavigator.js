import React, { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator } from "react-native";

import AuthContext from "../context/AuthContext";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import { setupResponseInterceptor } from "../api/client";


export default function AppNavigator() {

    const { token, isLoading, logout } = useContext(AuthContext);

    useEffect(() => {
        setupResponseInterceptor(logout);
    }, [logout]);

    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator size="large" />
            </View>
        )
    }

    return (
        <NavigationContainer>
            {
                token ? (<AppStack/>) : (<AuthStack/>)
            }
        </NavigationContainer>
    )
}
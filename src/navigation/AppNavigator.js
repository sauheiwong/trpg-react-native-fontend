import React, { useContext, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator } from "react-native";

import AuthContext from "../context/AuthContext";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";


export default function AppNavigator() {

    const { token, isLoading } = useContext(AuthContext);

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
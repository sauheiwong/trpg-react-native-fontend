import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import { COLORS } from "../constants/color";

const Stack = createNativeStackNavigator();

export default function AuthStack({ onLoginSuccess }) {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: COLORS.background },
                headerTintColor: COLORS.text,
                headerTitleStyle: { fontWeight: "bold" },
            }}
        >
            <Stack.Screen name="Login" options={{ title: "Login" }}>
                {(props) => <LoginScreen {...props} onLoginSuccess={onLoginSuccess}/>}
            </Stack.Screen>
        </Stack.Navigator>
    )
}

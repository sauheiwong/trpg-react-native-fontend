import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { COLORS } from "../constants/color";
import HomeScreen from "../screens/HomeScreen";
import SettingScreen from "../screens/SettingScreen";
import LoadGameChooseScreen from "../screens/LoadGameChooseScreen";
import COCGameListScreen from "../screens/COCGameListScreen";

const Stack = createNativeStackNavigator();

export default function AppStack() {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerStyle: { backgroundColor: COLORS.background },
                headerTintColor: COLORS.text,
                headerTitleStyle: { fontWeight: "bold" },
            }}
        >
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: "My Home Page" }}
            />
            <Stack.Screen
                name="Setting"
                component={SettingScreen}
                options={{ title: "Setting" }}
            />
            <Stack.Screen
                name="Load Game Choose"
                component={LoadGameChooseScreen}
                options={{ title: "Load Game Choose" }}
            />
            <Stack.Screen
                name="COC Game List"
                component={COCGameListScreen}
                options={{ title: "Call of Cthulhu Game List" }}
            />

        </Stack.Navigator>
    )
}
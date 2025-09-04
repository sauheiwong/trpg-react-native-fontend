import React, { useContext } from "react";
import  { View, Text, StyleSheet } from "react-native";
import CustomButton from "../components/CustomButton";
import { COLORS } from "../constants/color";
import AuthContext from "../context/AuthContext";

export default function HomeScreen({ navigation }) {

    const { logout } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <View style={styles.homeContainer}>
                <Text style={styles.title}>Welcome to TRPG with AI 🤖</Text>
                <CustomButton
                    title="New Game"
                    onPress={() => navigation.navigate("New Game Choose")}
                />
                <CustomButton
                    title="Load Game"
                    onPress={() => navigation.navigate("Load Game Choose")}
                />
                <CustomButton
                    title="Setting"
                    onPress={() => navigation.navigate("Setting")}
                />
                <CustomButton
                    title="Logout"
                    onPress={() => logout()}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.black,
    },
    title: {
        fontSize: 22,
        color: COLORS.text,
    },
    homeContainer: {
        width: "90%",
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
        borderRadius: 20,
    }
})
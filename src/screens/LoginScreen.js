import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import CustomButton from "../components/CustomButton";
import { COLORS } from "../constants/color";
import { Feather } from "@expo/vector-icons";

export default function LoginScreen({ navigation, onLoginSuccess }) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleLogin = () => {
        console.log("login button pressed, attempting to log in ...");
        onLoginSuccess({ username, password });
    }

    const handleGoToRegister = () => {
        navigation.navigate("Register");
    }

    return (
        <View style={styles.container}>
            <View style={styles.loginContainer}>
                <Text style={styles.title}>Login Page</Text>
                <TextInput 
                    style={[styles.input, { marginBottom: 15, width: "100%" }]} 
                    value={username} 
                    onChangeText={setUsername} 
                    placeholder="username"
                    placeholderTextColor={COLORS.tips}
                />
                <View style={styles.passwordContainer}>
                    <TextInput 
                        style={styles.input} 
                        value={password} 
                        onChangeText={setPassword} 
                        placeholder="password"
                        placeholderTextColor={COLORS.tips}
                        secureTextEntry={!isPasswordVisible}
                    />
                    <Pressable onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                        <Feather 
                            name={isPasswordVisible ? "eye-off" : "eye"}
                            size={24}
                            color={COLORS.text}
                        />
                    </Pressable>
                </View>
                <CustomButton
                    title="Login"
                    onPress={handleLogin}
                />
                <CustomButton
                    title="Register"
                    onPress={handleGoToRegister}
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
        padding: 20,
        backgroundColor: COLORS.black,
    },
    loginContainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.background,
        width: "90%",
        borderRadius: 20,
        padding: 20,
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        backgroundColor: COLORS.highlight1,
        borderRadius: 5,
        marginBottom: 15,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 24,
        color: COLORS.text,
    },
    input: {
        color: COLORS.text,
        backgroundColor: COLORS.highlight1,
        paddingVertical: 10,
        borderRadius: 5,
        width: "90%",
    }
})

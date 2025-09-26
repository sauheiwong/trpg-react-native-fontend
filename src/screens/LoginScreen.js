import React, { useEffect, useContext, useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Platform, Keyboard, KeyboardAvoidingView } from "react-native";

import CustomButton from "../components/CustomButton";
import { COLORS } from "../constants/color";
import { Feather } from "@expo/vector-icons";
import AuthContext from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
    const { login } = useContext(AuthContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [keyboardOffset, setKeyboardOffset] = useState(0);

    useEffect(() => {
        let keyboardDidShowListener = null;
        let keyboardDidHideListener = null;
        if (Platform.OS === "android") {
            const keyboardDidShowListener = Keyboard.addListener(
                "keyboardDidShow",
                (e) => {
                    setKeyboardOffset(e.endCoordinates.height)
                }
            );

            const keyboardDidHideListener = Keyboard.addListener(
                "keyboardDidHide",
                () => {
                    setKeyboardOffset(0);
                }
            );

            return () => {
                if (keyboardDidShowListener){
                    keyboardDidShowListener.remove()
                }
                if (keyboardDidHideListener){
                    keyboardDidHideListener.remove()
                }
            }
        }
    }, [])

    const handleLogin = async() => {
        console.log("login button pressed, attempting to log in ...");
        setIsLoading(true);
        setErrorMessage("");
        try {
            await login(username, password);
        } catch (error) {
            const message = error.response?.data?.message || "Login fail, please check your username and password"
            setErrorMessage(message);
        } finally {
            setIsLoading(false);
        }
    }

    const handleGoToRegister = () => {
        navigation.navigate("Register");
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
            keyboardVerticalOffset={Platform.OS === 'ios' ? 45 : 0}
        >
            <View style={styles.container}>
                <View style={[styles.loginContainer, {paddingBottom: keyboardOffset}]}>
                    <Text style={styles.title}>Login Page</Text>
                    <TextInput 
                        style={[styles.input, { marginBottom: 15, width: "100%" }]} 
                        value={username} 
                        onChangeText={setUsername} 
                        placeholder="Email"
                        placeholderTextColor={COLORS.tips}
                    />
                    <View style={styles.passwordContainer}>
                        <TextInput 
                            style={styles.input} 
                            value={password} 
                            onChangeText={setPassword} 
                            placeholder="Password"
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
                    {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
                    <CustomButton
                        title={isLoading ? "Logining..." : "Login"}
                        onPress={handleLogin}
                        disabled={isLoading}
                    />
                    <CustomButton
                        title="Register"
                        onPress={handleGoToRegister}
                        disabled={isLoading}
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
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
    },
    errorMessage: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.error,
    }
})

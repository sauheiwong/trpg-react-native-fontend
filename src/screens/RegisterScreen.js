import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Alert, Platform, Keyboard } from "react-native";
import CustomButton from "../components/CustomButton";
import { Feather } from "@expo/vector-icons";

import { COLORS } from "../constants/color";
import apiClient from "../api/client";

export default function RegisterScreen({ navigation }) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [comfirmPassword, setComfirmPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isComfirmPasswordVisible, setIsComfirmPasswordVisible] = useState(false);
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

    const handleRegister = async() => {
        console.log("Register button pressed, attempting to log in ...");
        setErrorMessage("");
        
        if (!username) {
            setErrorMessage("Empty username");
            return;
        }

        if (!password || !comfirmPassword) {
            setErrorMessage("Empty password")
            setPassword("");
            setComfirmPassword("");
            return;
        }

        if (password !== comfirmPassword) {
            setErrorMessage("Password does not match. Please check your password.")
            setPassword("");
            setComfirmPassword("");
            return;
        }

        console.log("Register start");
        setIsLoading(true);

        try{
            await apiClient.post("/register", {
                username,
                password,
            })

            console.log("Register success");

            Alert.alert(
                "Register Success",
                "You can login in now.",
                [{text: "ok", onPress: () => navigation.navigate("Login")}]
            )

        } catch (error) {
            // Axios 的錯誤處理更強大
            if (error.response) {
                // 請求已發出，但伺服器用非 2xx 的狀態碼回應
                // error.response.data 通常包含了後端的錯誤訊息
                console.error("Register error data:", error.response.data);
                setErrorMessage(error.response.data.message || 'Register fail, please try it later');
            } else if (error.request) {
                // 請求已發出，但沒有收到回應 (例如網路問題)
                console.error("Register network error:", error.request);
                setErrorMessage('Internal problem, please check your internal');
            } else {
                // 設定請求時發生了其他問題
                console.error('Error', error.message);
                setErrorMessage('unknown error');
            }
        } finally {
            setIsLoading(false);
            setPassword("");
            setComfirmPassword("");
        }
        
        console.log("Register success");

        return;
    }

    return (
        <View style={styles.container}>
            <View style={[styles.registerContainer, {paddingBottom: keyboardOffset}]}>
                <Text style={styles.title}>Register Page</Text>
                <TextInput 
                    style={[styles.input, { marginBottom: 15, width: "100%" }]} 
                    value={username} 
                    onChangeText={setUsername} 
                    placeholder="Email"
                    placeholderTextColor={COLORS.tips}
                    editable={!isLoading}
                />
                <View style={styles.passwordContainer}>
                    <TextInput 
                        style={styles.input} 
                        value={password} 
                        onChangeText={setPassword} 
                        placeholder="Password"
                        placeholderTextColor={COLORS.tips}
                        secureTextEntry={!isPasswordVisible}
                        editable={!isLoading}
                    />
                    <Pressable onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                        <Feather 
                            name={isPasswordVisible ? "eye-off" : "eye"}
                            size={24}
                            color={COLORS.text}
                        />
                    </Pressable>
                </View>
                <View style={styles.passwordContainer}>
                    <TextInput 
                        style={styles.input} 
                        value={comfirmPassword} 
                        onChangeText={setComfirmPassword} 
                        placeholder="Comfirm Password"
                        placeholderTextColor={COLORS.tips}
                        secureTextEntry={!isComfirmPasswordVisible}
                        editable={!isLoading}   
                    />
                    <Pressable onPress={() => setIsComfirmPasswordVisible(!isComfirmPasswordVisible)}>
                        <Feather 
                            name={isComfirmPasswordVisible ? "eye-off" : "eye"}
                            size={24}
                            color={COLORS.text}
                        />
                    </Pressable>
                </View>
                { errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text> }
                <CustomButton
                    title={isLoading ? "Registering ..." :"Register"}
                    onPress={handleRegister}
                    disabled={isLoading}
                />
                <CustomButton
                    title="Go To Login"
                    onPress={() => navigation.navigate("Login")}
                    disabled={isLoading}
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
    registerContainer: {
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

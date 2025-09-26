import React, { useEffect, useState } from "react";
import  { View, Text, StyleSheet, TextInput, Platform, Keyboard, KeyboardAvoidingView } from "react-native";
import CustomButton from "../components/CustomButton";
import { COLORS } from "../constants/color";
import apiClient from "../api/client";

export default function SettingScreen({ navigation }) {

    const [name, setName] = useState("");
    const [language, setLanguage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [keyboardOffset, setKeyboardOffset] = useState(0);

    useEffect(() => {
        const getUserInfor = async () => {
            const response = await apiClient.get("/user");
            setName(response.data.name);
            setLanguage(response.data.language);
            return;
        }
        getUserInfor()

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

    const handleSubmit = async() => {
        setIsLoading(true);
        setErrorMessage("");
        try{
            await apiClient.put("/user", { name, language });
            navigation.goBack();
        } catch (error) {
            console.error(`Error ⚠️: fail to edit user: ${error}`)
            setErrorMessage(error.response.data.message)
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
            keyboardVerticalOffset={Platform.OS === 'ios' ? 45 : 0}
        >
            <View style={styles.container}>
                <View style={[styles.homeContainer, {paddingBottom: keyboardOffset}]}>
                    <Text style={styles.title}>Setting Page ⚙️</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Name:</Text>
                        <TextInput
                            style={styles.input} 
                            value={name} 
                            onChangeText={setName} 
                            placeholder="your name"
                            placeholderTextColor={COLORS.tips}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Language:</Text>
                        <TextInput 
                            style={styles.input} 
                            value={language} 
                            onChangeText={setLanguage} 
                            placeholder="your language"
                            placeholderTextColor={COLORS.tips}
                        />
                    </View>
                    {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
                    <View style={styles.buttonContainer}>
                        <CustomButton
                            title={isLoading ? "Loading..." : "Submit"}
                            onPress={() => handleSubmit()}
                            disabled={isLoading}
                        />
                        <CustomButton
                            title="Go Back"
                            onPress={() => navigation.goBack()}
                        />
                    </View>
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
        backgroundColor: COLORS.black,
    },
    title: {
        fontSize: 22,
        color: COLORS.text,
        marginBottom: 20,
    },
    homeContainer: {
        width: "90%",
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
        borderRadius: 20,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginBottom: 10,
    },
    label: {
        fontSize: 18,
        color: COLORS.text,
        marginRight: "auto",
    },
    input: {
        backgroundColor: COLORS.highlight1,
        width: "60%",
        color: COLORS.text,
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        width: "100%"
    },
    errorMessage: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.error,
    }
})
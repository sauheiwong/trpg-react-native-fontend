import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform, ImageBackground } from "react-native";
import { useCOCGameStore } from "../stores/COCGameStore";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../constants/color";
import MessageBox from "../components/MessageBox";

export default function COCGameScreen({ route, navigation }) {
    const { itemData } = route.params;

    const { currentGameId, messages, title, isLoading, backgroundImageUrl } = useCOCGameStore();
    const setCurrentGame = useCOCGameStore((state) => state.setCurrentGame);
    const sendMessage = useCOCGameStore((state) => state.sendMessage);
    const clearStore = useCOCGameStore((state) => state.clearStore);

    const [inputText, setInputText] = useState("");

    useEffect(() => {
        if (itemData) {
            setCurrentGame(itemData);
        }
        return () => {
            clearStore();
        };
    }, [itemData]);

    const handleSendMessage = () => {
        sendMessage(inputText);
        setInputText("");
    }

    const renderGameContent = () => (
        <>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.openDrawer()}>
                    <Feather name="menu" size={24} color="white" />
                </Pressable>
                <Text style={styles.headerTitle}>{title}</Text>
                <Pressable onPress={() => navigation.goBack()}>
                    <Feather name="x" size={24} color="white" />
                </Pressable>
            </View>

            {/* chat */}
            <FlatList
                style={styles.messageList}
                data={messages}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <MessageBox role={item.role} content={item.content} />
                )}
                inverted
                contentContainerStyle={{ flexDirection: "column-reverse" }}
            />

            {/* input box */}
            <View style={styles.inputContainer}>
                <TextInput 
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="your message"
                    placeholderTextColor={COLORS.tips}
                />
                <Pressable style={styles.sendButton} onPress={handleSendMessage} disabled={isLoading}>
                    <Feather name="send" size={24} color={COLORS.tips}/>
                </Pressable>
            </View>
        </>
    )

    if (!currentGameId) {
        return <View style={styles.loadingContainer}><Text>Loading...</Text></View>
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={0}
        >
            { backgroundImageUrl ? (
                <ImageBackground
                    source={{ uri: backgroundImageUrl }}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                >
                    {renderGameContent()}
                </ImageBackground>
            ) : (
                <View style={styles.defaultBackground}>
                    {renderGameContent()}
                </View>
            )
            }
        </KeyboardAvoidingView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: COLORS.black,
    },
    backgroundImage: {
        flex: 1,
    },
    defaultBackground: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: COLORS.background,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginTop: 25,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    messageList: {
        flex: 1,
        padding: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: COLORS.background,
        marginBottom: 25,
    },
    input: {
        flex: 1,
        height: 40,
        backgroundColor: COLORS.highlight1,
        borderRadius: 20,
        paddingHorizontal: 15,
        color: COLORS.text
    },
    sendButton: {
        marginLeft: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.highlight2,
        justifyContent: 'center',
        alignItems: 'center',
    },
});


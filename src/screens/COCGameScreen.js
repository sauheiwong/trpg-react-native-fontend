import React, { useEffect, useState } from "react";
import { 
    View, Text, StyleSheet, FlatList, TextInput, Pressable, 
    KeyboardAvoidingView, Platform, ImageBackground
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
        console.log("itemData is: ", JSON.stringify(itemData));
        if (itemData) {
            setCurrentGame(itemData);
        }
        return () => {
            clearStore();
        };
    }, [itemData]);

    const handleSendMessage = () => {
        if (inputText.trim().length > 0) {
            sendMessage(inputText);
            setInputText("");
        }
    }

    if (!currentGameId) {
        return <View style={styles.loadingContainer}><Text style={styles.loadingText}>Loading...</Text></View>
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
    );

    return (
        <ImageBackground
            source={backgroundImageUrl ? { uri: backgroundImageUrl } : null}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined} // <--- 在 Android 上禁用行為
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                    enabled={Platform.OS === 'ios'} // <--- 也可以直接在 Android 上禁用此組件
                >
                    {renderGameContent()}
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    container: {
        flex: 1,
        backgroundColor: "transparent",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    loadingText: {
        color: COLORS.text,
        fontSize: 24,
        fontWeight: "bold",
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10, // 調整垂直 padding
        backgroundColor: COLORS.background,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        // 不再需要 marginTop，交給 SafeAreaView 處理
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    messageList: {
        flex: 1,
        paddingHorizontal: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: COLORS.background,
        // 不再需要 marginBottom，交給 SafeAreaView 處理
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
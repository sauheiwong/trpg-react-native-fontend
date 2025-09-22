import React, { useEffect, useState } from "react";
import { 
    View, Text, StyleSheet, FlatList, TextInput, Pressable, 
    KeyboardAvoidingView, Platform, ImageBackground, Keyboard
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements"
import { useCOCGameStore } from "../stores/COCGameStore";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../constants/color";
import MessageBox from "../components/MessageBox";

export default function COCGameScreen({ route, navigation }) {
    const { itemData } = route.params;

    const { currentGameId, messages, title, isLoading, backgroundImageUrl, isCharacterChanged } = useCOCGameStore();
    const setCurrentGame = useCOCGameStore((state) => state.setCurrentGame);
    const sendMessage = useCOCGameStore((state) => state.sendMessage);
    const clearStore = useCOCGameStore((state) => state.clearStore);
    const turnOffCharacterNotification = useCOCGameStore((state) => state.turnOffCharacterNotification)

    const [inputText, setInputText] = useState("");
    const [keyboardOffset, setKeyboardOffset] = useState(0);

    const headerHeight = useHeaderHeight();

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
            Keyboard.dismiss();
        }
    }

    const handleOpenDrawer = () => {
        navigation.openDrawer()
        turnOffCharacterNotification()
    }

    if (!currentGameId) {
        return <View style={styles.loadingContainer}><Text style={styles.loadingText}>Loading...</Text></View>
    }

    const renderGameContent = () => (
        <>
            <View style={styles.header}>
                <Pressable onPress={() => handleOpenDrawer()}>
                    <Feather name="menu" size={24} color={isCharacterChanged ? COLORS.highlight1 : "white"} />
                </Pressable>
                <Text style={styles.headerTitle}>{title}</Text>
                <Pressable onPress={() => navigation.goBack()}>
                    <Feather name="x" size={24} color="white" />
                </Pressable>
            </View>

            <FlatList
                style={styles.messageList}
                data={[...messages].reverse()}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <MessageBox role={item.role} content={item.content} />
                )}
                inverted
            />

            <View style={styles.inputContainer}>
                <TextInput 
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="your message"
                    placeholderTextColor={COLORS.tips}
                    multiline
                    returnKeyType="send"
                    onSubmitEditing={handleSendMessage}
                />
                <Pressable style={styles.sendButton} onPress={handleSendMessage} disabled={isLoading}>
                    <Feather name="send" size={24} color={COLORS.tips}/>
                </Pressable>
            </View>
        </>
    );

    return (
        <SafeAreaView style={[styles.container, {paddingBottom: keyboardOffset}]}>
            <ImageBackground
                source={backgroundImageUrl ? { uri: backgroundImageUrl } : null}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
                    keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
                >
                    {renderGameContent()}
                </KeyboardAvoidingView>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
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
        alignItems: "flex-end"
    },
    input: {
        flex: 1,
        minHeight: 40,
        maxHeight: 120,
        backgroundColor: COLORS.highlight1,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        color: COLORS.text,
        fontSize: 16,
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
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import DrawerLayout from "react-native-drawer-layout";
import { useCOCGameStore } from "../stores/COCGameStore";
import SideMenu from "../components/SideMenu";
import { Feather } from "@expo/vector-icons";
import MessageBox from "../components/MessageBox";
import { COLORS } from "../constants/color";

export default function COCGameScreen({ route, navigation}) {
    const { itemData } = route.params;
    const drawerRef = useRef(null);

    const { currentGameId, messages, title, isLoading } = useCOCGameStore();
    const setCurrentGame = useCOCGameStore((state) => state.setCurrentGame);
    const sendMessage = useCOCGameStore((state) => state.sendMessage);
    const clearStore = useCOCGameStore((state) => state.clearStore);

    const [inputText, setInputText] = useState("");

    useEffect(() => {
        if (itemData) {
            setCurrentGame(itemData.gameId);
        }
        return () => {
            clearStore();
        };
    }, [itemData]);

    const handleSendMessage = () => {
        sendMessage(inputText);
        setInputText("");
    }

    if (!currentGameId) {
        return <View style={styles.container}><Text>Loading...</Text></View>
    }

    return (
        <DrawerLayout   
            ref={drawerRef}
            drawerWidth={300}
            drawerPosition="left"
            renderNavigationView={() => <SideMenu closeDrawer={() => drawerRef.current?.closeDrawer()}/>}
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
            >
                <View style={styles.header}>
                    <Pressable onPress={() => drawerRef.current?.openDrawer()}>
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
            </KeyboardAvoidingView>

        </DrawerLayout>
    )

}

const styles = StyleSheet.create({
    container: {
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
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
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
        backgroundColor: 'white',
    },
    input: {
        flex: 1,
        height: 40,
        backgroundColor: COLORS.highlight1,
        borderRadius: 20,
        paddingHorizontal: 15,
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


import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Pressable, TextInput } from "react-native";
import { useCOCGameStore } from "../stores/COCGameStore";
import CustomButton from "./CustomButton";
import { COLORS } from "../constants/color";

export default function SideMenu({ navigation }) { // Drawer 會傳入 navigation prop
    const { character, title, memo } = useCOCGameStore();
    const editTitle = useCOCGameStore((state) => state.editTitle);

    const [isEditing, setIsEditing] = useState(false);
    const [editableTitle, setEdiableTitle] = useState(title);
    
    useEffect(() => {
        setEdiableTitle(title);
    }, [title])

    const handleStartEditing = () => {
        setIsEditing(true);
    }

    const handleSaveTitle = () => {
        if (editableTitle.trim()) {
            editTitle(editableTitle.trim());
        } else {
            setEdiableTitle(title);
        }
        setIsEditing(false);
    }

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                {isEditing ? (
                    <TextInput
                        style={styles.input}
                        value={editableTitle}
                        onChangeText={setEdiableTitle}
                        autoFocus={true} // 自動獲取焦點，彈出鍵盤
                        onBlur={handleSaveTitle} // 失去焦點時儲存
                        onSubmitEditing={handleSaveTitle} // 點擊鍵盤 "完成" 或 "換行" 時儲存
                    />
                ) : (
                    <Pressable onPress={handleStartEditing}>
                        <Text style={styles.title}>{title}  🖋️</Text>
                    </Pressable>
                )
                }
            </View>
            <View style={styles.characterContainer}>
                {character?.imageUrl 
                ? (<Image 
                    source={{ uri: character.imageUrl }}
                    style={styles.avatar}
                />) 
                : (
                    <Text style={styles.tips}>Ask Gemini to generate your character avatar😉</Text>
                )
                }
                { character ? (
                    <>
                        <Text style={styles.characterDetail}>Name: {character.name}</Text>
                        <Text style={styles.characterDetail}>Class: {character.class}</Text>
                        <Text style={styles.characterDetail}>HP: {character.hp.current}/{character.hp.max}</Text>
                        <Text style={styles.characterDetail}>MP: {character.mp.current}/{character.mp.max}</Text>
                        <Text style={styles.characterDetail}>SAN: {character.san}/100</Text>
                        <View style={styles.attributes}>

                        </View>
                    </>
                )
                : (
                    <Text style={styles.tips}>Create your character with Gemini😎</Text>
                )
            }

            </View>
            {/* 你可以在這裡加上一個關閉按鈕 */}
            <CustomButton
                title="Close Menu"
                onPress={() => navigation.closeDrawer()} // 使用 navigation 來關閉
            />
            <CustomButton
                title="Go Back Home"
                onPress={() => navigation.navigate("Home")}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: COLORS.black,
        paddingTop: 75, // 增加一些頂部空間
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        gap: 10,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: COLORS.tips,
        marginBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.text,
    },
    input: {
        flex: 1,
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.text,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.tips,
        paddingVertical: 5,
    },
    characterContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    characterDetail: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.text,
        marginTop: 10,
    },
    tips: {
        fontSize: 16,
        color: COLORS.tips,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50, // 讓圖片變成圓形
        borderWidth: 2,
        borderColor: '#ddd',
        marginBottom: 10,
    }
})
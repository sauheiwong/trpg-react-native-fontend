import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useCOCGameStore } from "../stores/COCGameStore";
import CustomButton from "./CustomButton";
import { COLORS } from "../constants/color";

export default function SideMenu({ navigation }) { // Drawer 會傳入 navigation prop
    const { character, title, memo } = useCOCGameStore();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
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
        paddingTop: 50, // 增加一些頂部空間
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.text,
        marginBottom: 40,
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
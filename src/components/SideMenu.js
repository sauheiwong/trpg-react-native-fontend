import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Pressable, TextInput, ScrollView } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import { useCOCGameStore } from "../stores/COCGameStore";
import CustomButton from "./CustomButton";
import { COLORS } from "../constants/color";

export default function SideMenu(props) { // Drawer 會傳入 navigation prop
    const { navigation } = props;

    const { character, title, memo } = useCOCGameStore();
    const editTitle = useCOCGameStore((state) => state.editTitle);
    // const openFormModal = useCOCGameStore((state) => state.openFormModal)

    const [isEditing, setIsEditing] = useState(false);
    const [editableTitle, setEdiableTitle] = useState(title);
    const [openDetail, setOpenDetail] = useState(false);
    
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
        <DrawerContentScrollView 
            {...props}
            style={styles.scrollView}
            contentContainerStyle={styles.container}
        >
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
                        <View style={styles.mainDetailContainer}>
                            <Text style={styles.characterDetail}>Name: {character.name}</Text>
                            <Text style={styles.characterDetail}>Class: {character.class}</Text>
                            <Text style={styles.characterDetail}>HP: {character.hp.current}/{character.hp.max}</Text>
                            <Text style={styles.characterDetail}>MP: {character.mp.current}/{character.mp.max}</Text>
                            <Text style={styles.characterDetail}>SAN: {character.san}/100</Text>
                        </View>
                        { openDetail ? (
                            <>
                                <View style={styles.attributesGridContainer}>
                                    {Object.keys(character.attributes).map((key, index) => (
                                        <View style={styles.attributeGridItem} key={index}>
                                            <Text style={styles.attributeItemText}>
                                                {key}: {character.attributes[key]}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                                <View style={styles.attributesGridContainer}>
                                    {Object.keys(character.skills).map((key, index) => (
                                        <View style={styles.attributeGridItem} key={index}>
                                            <Text style={styles.attributeItemText}>
                                                {key}: {character.skills[key]}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                                <View style={styles.desciprtionContainer}>
                                    <Text style={styles.desciprtionText}>{character.description}</Text>
                                </View>
                                <CustomButton
                                    title="Close Detail"
                                    onPress={() => setOpenDetail(!openDetail)} 
                                />
                            </>
                        ) : (
                            <CustomButton
                                title="Open Detail"
                                onPress={() => setOpenDetail(!openDetail)} 
                            />
                        )
                        }
                    </>
                )
                : (
                    <Text style={styles.tips}>Create your character with Gemini😎</Text>
                )
            }

            </View>

            {/* 你可以在這裡加上一個關閉按鈕 */}
            {/* <CustomButton
                title="test Modal open"
                onPress={() => openFormModal()}
            /> */}
            <CustomButton
                title="Close Menu"
                onPress={() => navigation.closeDrawer()} // 使用 navigation 來關閉
            />
            <CustomButton
                title="Go Back Home"
                onPress={() => navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                })}
            />
        </DrawerContentScrollView>
    )
}

const styles = StyleSheet.create({
    divider: {
        borderBottomColor: COLORS.tips,
        borderBottomWidth: 1,
        marginVertical: 20, // 上下留白
    },
    scrollView: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    container: {
        paddingHorizontal: 20,
        paddingVertical: 75, // 增加一些頂部空間
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
    },
    mainDetailContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
    },
    attributesGridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%",
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: COLORS.tips,
    },
    attributeGridItem: {
        width: "50%",
        paddingHorizontal: 5,
        marginBottom: 10,
    }, 
    attributeItemText: {
        fontSize: 15,
        color: COLORS.text,
    },
    desciprtionContainer: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: COLORS.tips,
        paddingVertical: 20,
    }, 
    desciprtionText: {
        fontSize: 15,
        color: COLORS.text,
    }
})
import React from "react";
import { View, Text, StyleSheet, Dimensions, Image, Pressable } from "react-native";
import Markdown from "react-native-markdown-display";
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from "../constants/color.js";
import { useCOCGameStore } from "../stores/COCGameStore.js";

const iconsObj = {
    "user": "🧑",
    "model": "🤖",
    "system": "⚙️"
}

const { width: screenWidth } = Dimensions.get("window");
const maxImageWidth = screenWidth * 0.8 - 24;

const markdownRules = {
    image: (node, children, parent, styles) => {
        const { src } = node.attributes;
        return (
            <Image
                key={node.key}
                source={{ uri: src }}
                style={{
                    width: maxImageWidth,
                    height: undefined,
                    aspectRatio: 1,
                    borderRaduis: 15,
                    marginTop: 8,
                    flex: 1,
                    justifyContent: "center"
                }}
                resizeMode="contain"
            />
        )
    }
}

export default function MessageBox({ message }) {
    const { role, content, _id } = message;
    const { bookmarks, addBookmark, removeBookmark } = useCOCGameStore();

    const isBookmarked = bookmarks.some(bookmark => bookmark._id === _id);

    const handleBookmark = () => {
        if (isBookmarked) {
            removeBookmark(_id);
        } else {
            addBookmark(_id);
        }
    }

    return (
        <View>
            <View style={[styles.avatar, styles[`${role}Avatar`]]}>
                <Text style={styles.avatarIcon}>{iconsObj[`${role}`]}</Text>
            </View>
            <View style={[styles.messageBubble, styles[`${role}Bubble`], role === 'user' ? styles.userMessageBubble : styles.modelMessageBubble]}>
                {role !== 'system' && (
                    <Pressable 
                        onPress={handleBookmark} 
                        style={[styles.bookmarkButton, role === 'user' ? styles.userBookmarkButton : styles.modelBookmarkButton]}
                    >
                        <Ionicons 
                            name={isBookmarked ? "bookmark" : "bookmark-outline"} 
                            size={20} 
                            color={isBookmarked ? COLORS.highlight2 : COLORS.tips} 
                        />
                    </Pressable>
                )}
                <Markdown style={markdownStyles} rules={markdownRules}>
                    {content}
                </Markdown>
            </View>
        </View>
    )
}

const markdownStyles = StyleSheet.create({
    text: {
        color: COLORS.text,
        fontSize: 16,
    },
    br: {
        color: COLORS.tips,
    },
    code_inline: {
        backgroundColor: 'transparent',
        color:COLORS.text,
        fontSize: 15,
    },
    ordered_list_icon: {
        color: COLORS.text,
        fontSize: 18,
    },
    bullet_list_icon: {
        color: COLORS.text,
        fontSize: 18,
    },
    blockquote: {
        backgroundColor: COLORS.backgroundColor,
        color: COLORS.black,
    },
    table: {
        borderWidth: 1,
        borderColor: COLORS.tips,
        borderRadius: 5,
        marginVertical: 15,
    },
    td: {
        borderWidth: 1,
        borderColor: COLORS.tips,
        padding: 8,
        fontSize: 15,
    },
    th: {
        borderWidth: 1,
        borderColor: COLORS.tips,
        fontWeight: "bold"
    }
})

const styles = StyleSheet.create({
    messageBubble: {
        padding: 10,
        borderRadius: 20,
        marginBottom: 10,
        maxWidth: "90%",
        minWidth: "10%",
        position: 'relative',
        paddingTop: 15, // Space for the bookmark icon
    }, 
    userMessageBubble: {
        paddingRight: 10, // Make space for bookmark icon
    },
    modelMessageBubble: {
        paddingLeft: 10, // Make space for bookmark icon
    },
    userBubble: {
        backgroundColor: COLORS.highlight1,
        alignSelf: "flex-end",
    },
    systemBubble: {
        backgroundColor: "rgba(20, 20, 20, 0.9)",
        alignSelf: "flex-start",
    },
    modelBubble: {
        backgroundColor: "rgba(20, 20, 20, 0.9)",
        alignSelf: "flex-start",
    },
    avatar: {
        width: 35,
        height: 35,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        borderColor: COLORS.highlight1,
        borderWidth: 2,
        backgroundColor: COLORS.background,
        marginBottom: 10, // Pull the bubble up, adjusted from -25
        zIndex: 1, // Make sure avatar is on top
    },
    avatarIcon: {
        fontSize: 21,
    },
    userAvatar: {
        alignSelf: "flex-end",
        marginRight: 5,
    },
    modelAvatar: {
        alignSelf: "flex-start",
        marginLeft: 5,
    },
    bookmarkButton: {
        position: 'absolute',
        top: 5,
        zIndex: 2, // Ensure button is clickable
    },
    userBookmarkButton: {
        left: 10,
    },
    modelBookmarkButton: {
        right: 10,
    },
})
import React from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import Markdown from "react-native-markdown-display";

import { COLORS } from "../constants/color.js"

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

export default function MessageBox({ role, content }) {
    return (
        <View>
            <View style={[styles.avatar, styles[`${role}Avatar`]]}>
                <Text style={styles.avatarIcon}>{iconsObj[`${role}`]}</Text>
            </View>
            <View style={[styles.messageBubble, styles[`${role}Bubble`]]}>
                {/* <Text style={styles.messageText}>{content}</Text> */}
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
})

const styles = StyleSheet.create({
    messageBubble: {
        padding: 12,
        borderRadius: 20,
        marginBottom: 10,
        maxWidth: "80%",
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
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderColor: COLORS.highlight1,
        borderWidth: 2,
        backgroundColor: COLORS.background,
    },
    avatarIcon: {
        fontSize: 21,
    },
    userAvatar: {
        alignSelf: "flex-end"
    },
})
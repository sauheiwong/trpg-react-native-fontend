import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { COLORS } from "../constants/color.js"

const iconsObj = {
    "user": "🧑",
    "model": "🤖",
    "system": "⚙️"
}

export default function MessageBox({ role, content }) {
    return (
        <View style={[styles.messageBubble, styles[`${role}Bubble`]]}>
            <Text style={styles.messageText}>{iconsObj[`${role}`]}:{content}</Text>
        </View>
    )
}

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
    messageText: {
        color: COLORS.text,
        fontSize: 16,
    }
})
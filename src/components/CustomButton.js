import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

export default function CustomButton({ title, onPress }) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                { backgroundColor: pressed ? "#dddddd" : "#6200ee" }
            ]}
            onPress={onPress}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        elevation: 3,
        marginVertical: 10,
    },
    buttonText: {
        fontSize: 16,
        color: "white",
        fontWeight: "bold",
    }
})
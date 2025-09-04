import React from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";

import { COLORS } from "../constants/color.js"

export default function GameList({ game, onPress }) {
    return (
        <Pressable onPress={() => onPress(game._id)} style={styles.itemContainer}>
            <Text style={styles.title}>{game.title}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    itemContainer: {
        backgroundColor: COLORS.highlight1,
        borderRadius: 5,
        width: "90%",
        padding: 20,
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        color: COLORS.text,
    }
})
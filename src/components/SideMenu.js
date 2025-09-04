import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useCOCGameStore } from "../stores/COCGameStore";
import CustomButton from "./CustomButton";
import { COLORS } from "../constants/color";

export default function SideMenu({ closeDrawer }) {
    const { character, title, memo } = useCOCGameStore();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.characterName}>{character.name}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: COLORS.black,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.text,
    },
    characterName: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.text,
    }
})

import React from "react";
import  { View, Text, StyleSheet } from "react-native";
import CustomButton from "../components/CustomButton";
import { COLORS } from "../constants/color";

export default function LoadGameChooseScreen({ navigation }) {

    return (
        <View style={styles.container}>
            <View style={styles.homeContainer}>
                <Text style={styles.title}>Which Type of TRPG ?</Text>
                <CustomButton
                    title="Call of Cthulhu 🐙"
                    onPress={() => navigation.navigate("COC Game List")}
                />
                <CustomButton
                    title="Dungeons & Dragons 🐉"
                    onPress={() => navigation.navigate("DND Game List")}
                />
                <CustomButton
                    title="Go Back"
                    onPress={() => navigation.goBack()}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.black,
    },
    title: {
        fontSize: 22,
        color: COLORS.text,
    },
    homeContainer: {
        width: "90%",
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
        borderRadius: 20,
    }
})
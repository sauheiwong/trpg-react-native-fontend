import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CustomButton from "../components/CustomButton";

export default function DetailScreen({ route, navigation }) {

    const { itemId, otherParam } = route.params || {}

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Here is detail page📃</Text>
            {itemId && <Text style={styles.paramText}>Got itemId is: {itemId}</Text>}
            {otherParam && <Text style={styles.paramText}>Got data is : {otherParam}</Text>}
            <CustomButton
                title="go back"
                onPress={() => navigation.goBack()}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e0e0e0",
    },
    text: {
        fontSize: 22,
        marginBottom: 20,
    },
    paramText: {
        fontSize: 16,
        color: "#333",
        marginBottom: 10,
    }
})
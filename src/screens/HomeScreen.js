import React from "react";
import  { View, Text, StyleSheet } from "react-native";
import CustomButton from "../components/CustomButton";

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Here is home page🏠</Text>
            <CustomButton
                title={"go to detail page with data"}
                onPress={() => {
                    navigation.navigate("Detail", {
                        itemId: 88,
                        otherParam: "from home page"
                    })
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItem: "center",
        backgroundColor: "#f5f5f5",
        paddingHorizontal: 20,
    },
    text: {
        fontSize: 22,
        marginBottom: 20.
    }
})
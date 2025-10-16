import React, { useEffect, useState } from "react";
import  { View, Text, StyleSheet, ActivityIndicator, FlatList, ScrollView } from "react-native";
import { COLORS } from "../constants/color";

import CustomButton from "../components/CustomButton";
import GameList from "../components/GameList";
import apiClient from "../api/client";
import { useCOCGameStore } from "../stores/COCGameStore";

export default function COCGameListScreen({ navigation }) {

    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const createNewGame = useCOCGameStore((state) => state.createNewGame);

    useEffect(() => {
        fetchGames();
    }, [])

    const fetchGames = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get("/game");
            setGames(response.data.games)
        } catch (e) {
            console.error("Error ⚠️: fail to fetch games: ", e);
            setError("Fail to fetch game list, please try it later.")
        } finally {
            setIsLoading(false);
        }
    }

    const handleGamePress = (gameId) => {
        console.log(`press game with id: ${gameId}`)
        navigation.navigate("COCGameDrawer", { 
            screen: "COCGameScreen",
            params: { itemData: gameId },
         })
    }

    const handleNewGame = async () => {
        console.log("start new COC game");
        navigation.navigate("COCGameDrawer", {
            screen: "COCGameScreen",
            params: { itemData: null },
        });
        await createNewGame({ new_game_screen: "COCGameList" });

    }

    return (
        <View style={styles.container}>
            <View style={styles.listContainer}>
                <Text style={styles.title}>Call of Cthulhu Game List</Text>
                {isLoading ? 
                    (<View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.highlight1}/>
                        <Text>Loading...</Text>
                    </View>)
                    :
                    (
                        <View style={styles.gameListContainer}>
                            <FlatList
                                data={games}
                                keyExtractor={(game) => game._id}
                                renderItem={({ item }) => <GameList game={item} onPress={handleGamePress}/>}
                                ListEmptyComponent={<Text>Game not found, please click "New Game" to start a new game</Text>}
                            />
                        </View>
                    )
                }
                { error && (
                    <View style={styles.errorContainer}>
                        <Text>{error}</Text>
                        <CustomButton
                            title="Retry"
                            onPress={fetchGames}
                        />
                    </View>
                )}
                <View style={styles.buttonContainer}>
                    <CustomButton
                        title="New Game"
                        onPress={() => handleNewGame()}
                    />
                    <CustomButton
                        title="Go Back"
                        onPress={() => navigation.goBack()}
                    />
                </View>
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
    listContainer: {
        width: "90%",
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
        borderRadius: 20,
    },
    title: {
        fontSize: 22,
        color: COLORS.text,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        width: "100%"
    },
    loadingContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    gameListContainer: {
        width: "100%",
        maxHeight: "80%"
    }
})
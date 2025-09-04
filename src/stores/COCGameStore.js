import { create } from 'zustand';
import apiClient from '../api/client';

export const useGameStore = create((set, get) => ({
    // State
    currentGameId: null,
    currentGame: null,
    messages: [],
    isLoading: false,
    character: null,
    title: null,
    memo: null,
    backgroundImageUrl: null,
    errorMessage: null,
    memoSaveStatus: null,

    setCurrentGame: async (gameId) => {
        console.log("loading game infor");
        if (!gameId) {
            console.error("Error ⚠️: empty game id");
            return;
        }

        set({ isLoading: true })

        try {
            const response = await apiClient.get(`/game/${gameId}`);
            const data = response.data;
            set({ 
                currentGameId: gameId,
                title: data.title,
                messages: data.messages,
                character: data.character,
                memo: data.memo,
                backgroundImageUrl: data.backgroundImageUrl
             })
        } catch (e) {
            console.error(`Error ⚠️: fail to fetch game with id: ${gameId}: ${e.messages}`);
            set((state) => ({ messages: [
                ...state.messages, 
                { 
                    role: "system", 
                    content: `Error ⚠️: fail to fetch game with id: ${gameId}` 
                }
            ]}))
        } finally {
            set({ isLoading: false })
        }

    }

}))

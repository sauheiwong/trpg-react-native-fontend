import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
import * as SecureStore from "expo-secure-store";
import * as Haptics from 'expo-haptics';

import apiClient from '../api/client';
import { API_CONFIG } from '../api/API';

export const useCOCGameStore = create(persist((set, get) => ({
    // State
    socket: null,
    currentGameId: null,
    messages: [],
    isLoading: false,
    character: null,
    title: null,
    memo: null,
    backgroundImageUrl: null,
    memoSaveStatus: null,
    loadingMessageId: null,
    isCharacterChanged: false,
    originTitle: null,
    isFormModalVisible: false,
    hasModal: false,
    formData: {},
    
    // Action 
    replaceLoadingMessage: ({ role, newMessage, keepLoading, followingMessage, isError }) => {
        const loadingId = get().loadingMessageId;
        if (!loadingId) {
            set((state) => ({
                messages: [...state.messages, {
                     _id: Date.now(), 
                     role, 
                     content: newMessage 
                }]
            }))
        } else {
            set((state) => ({
                messages: state.messages.map(message =>
                    message._id === loadingId
                    ? { ...message, role, content: newMessage }
                    : message
                ),
                isLoading: keepLoading,
                loadingMessageId: keepLoading ? loadingId : null,
            }))
            if (followingMessage) {
                console.log("has following message: ", followingMessage);
                const loadingMessageId = Date.now() + 1;
                set((state) => ({
                    messages: [...state.messages, {
                        _id: loadingMessageId,
                        role: "system",
                        content: followingMessage,
                    }],
                    isLoading: true,
                    loadingMessageId,
                }))
            }
        }
    },
    // Socket

    connect: async () => {
        if (get().socket) {
            return;
        }

        console.log("Attempting to connect to socket server...");

        try {

            const token = await SecureStore.getItemAsync("userToken");

            if (!token) {
                throw new Error("Error ⚠️: token not found.")
            }

            const newSocket = io(API_CONFIG.SOCKET_URL, {
                auth: { token: token.substring(7) }
            })

            newSocket.on("connect", () => {
                console.log("Socket connected successfully! ID: ", newSocket.id);
                const gameId = get().currentGameId;
                if (gameId) {
                    console.log(`Emitting "joinGame" from gameId ${gameId}`)
                    newSocket.emit("joinGame", gameId)
                }
            })

            newSocket.on("game:created", (data) => {
                console.log("Event 'game:created' received: ", data);

                set({ 
                    messages: [{
                        _id: Date.now(),
                        role: "model",
                        content: data.message,
                    }],
                    currentGameId: data.gameId,
                    isLoading: false,
                    title: "Default Title",
                 })
                console.log(`Manually emiiting "joinGame" for gameId ${data.gameId}`);
                get().socket.emit("joinGame", data.gameId);
            });

            newSocket.on("message:received", (data) => {
                const { message, role } = data;
                console.log("received message");

                get().replaceLoadingMessage({ role, newMessage: message })
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
            })

            newSocket.on("systemMessage:received", (data) => {
                const { message, followingMessage, keepLoading, isError } = data;
                console.log(`Event, 'systemMessage:received' received: ${message}`);

                get().replaceLoadingMessage({ 
                    role: "system", 
                    newMessage: message, 
                    followingMessage, 
                    keepLoading, 
                    isError 
                })
            })

            newSocket.on("backgroundImage:updated", ({ imageUrl }) => {
                set({ backgroundImageUrl: imageUrl });
            })

            newSocket.on("newCharacter:received", ({ newCharacter }) => {
                set({ 
                    character: newCharacter,
                    isCharacterChanged: true,
                    originTitle: get().title,
                    title: "<-- Your New Character",
                 })
            })

            newSocket.on("characterImage:updated", (data) => {
                console.log("Event 'characterImage:updated' got character image url")
                const { imageUrl } = data;
                if (!get().character) {
                    return;
                }
                set((state) => ({
                    character: { ...state.character, imageUrl },
                    isCharacterChanged: true,
                }))
            })

            newSocket.on("message:error", (data) => {
                console.log("Error ⚠️: sever error")
                get().replaceLoadingMessage({ role: "system", newMessage: data.error })
            })

            newSocket.on("formAvailable:received", ({ formData }) => {
                console.log(`got formData:\n${JSON.stringify(formData, null, 2)}`)
                setTimeout(() => {
                    set({
                        formData: formData,
                        hasModal: true
                    })
                }, 1000)
            })

            newSocket.on("disconnect", () => {
                console.log("Socket disconnected.")
            })

            set({ socket: newSocket });

        } catch (e) {
            console.error("Error ⚠️: fail to connect socket: ", e)
        }
    },

    disconnect: () => {
        if (get().socket) {
            get().socket.disconnect();
            set({ socket: null })
        }
    },

    createNewGame: async () => {
        set({ isLoading: true });
        await get().connect(); 
        const socket = get().socket;
        socket.emit("game:create");
    },

    openFormModal: () => set({ 
        isFormModalVisible: true,
    }),

    closeFormModal: () => set({
        isFormModalVisible: false,
    }),

    updateFormDataItem: (fieldName, value) => {
        set((state) => ({
        formData: {
            ...state.formData, 
            items: {
                ...state.formData.items,
                [fieldName]: {
                    ...state.formData.items[fieldName], 
                    value
                }
            }
        }
    }))},

    confirmForm: () => {
        const { formData, sendMessage } = get();
        const submitForm = {}
        if (formData.items) {
            Object.entries(formData.items).forEach(([key, item]) => {
                submitForm[item.key] = parseInt(item.value, 10)
            })
        }
        console.log(`Comfirm form:\n${JSON.stringify(submitForm, null, 2)}`);
        sendMessage(JSON.stringify(submitForm, null, 2))
        set({
            formData: {},
            isFormModalVisible: false,
            hasModal: false,
        })
    },

    setCurrentGame: async (gameId) => {
        console.log("loading game infor");
        if (!gameId) {
            console.error("Error ⚠️: empty game id");
            return;
        }

        set({ isLoading: true })
        await get().connect();

        try {
            const response = await apiClient.get(`/game/${gameId}`);
            const data = response.data;
            set({ 
                currentGameId: gameId,
                title: data.title,
                messages: data.messages,
                character: data.character,
                memo: data.memo,
                backgroundImageUrl: data.game.currentBackgroundImage
             })

             const socket = get().socket;
             if (socket && socket.connected) {
                console.log(`Manually emiiting "joinGame" for gameId ${gameId}`);
                socket.emit("joinGame", gameId);
             }
        } catch (e) {
            console.error(`Error ⚠️: fail to fetch game with id: ${gameId}: ${e}`);
            set((state) => ({ messages: [
                ...state.messages, 
                { 
                    _id: Date.now(),
                    role: "system", 
                    content: `Error ⚠️: fail to fetch game with id: ${gameId}` 
                }
            ]}))
        } finally {
            set({ isLoading: false })
        }
    },

    reloadCurrentGame: async () => {
        const { currentGameId, isLoading, setCurrentGame } = get();
        
        // Prevent reloading if already loading or no game is active
        if (isLoading || !currentGameId) {
            console.log("Reload prevented: already loading or no current game.");
            return;
        }
        
        console.log(`Reloading game data for gameId: ${currentGameId}`);
        await setCurrentGame(currentGameId);
    },

    sendMessage: async (userMessage) => {
        if (!userMessage || userMessage.trim() === "") {
            return;
        }
        const { socket, currentGameId } = get();

        const newMessage = {
            _id: Date.now(),
            role: "user",
            content: userMessage
        }

        const loadingId = Date.now() + 1;

        const loadingMessage = {
            _id: loadingId,
            role: "system",
            content: "Gemini is reading your message...🤔"
        }

        set((state) => ({ 
            messages: [...state.messages, newMessage, loadingMessage],
            loadingMessageId: loadingId,
            isLoading: true,
        }))

        if (userMessage.startsWith("/roll")) {
            const diceString = userMessage.substring("/roll ".length).trim();
            if (!diceString) return;

            try {
                await apiClient.post("/roll", {
                    dice: diceString,
                    gameId: get().currentGameId
                })

            } catch (error){
                console.error(`Error ⚠️: fail to roll a dice: ${error}`)
                get().replaceLoadingMessage({ 
                    role: "system", 
                    message: "Error ⚠️: fail to roll a dice",
                    isError: true,
                })
            }
            return;
        }

        socket.emit("sendMessage", {
            gameId: currentGameId,
            message: userMessage,
        })
    },

    editTitle: async(newTitle) => {
        if (!newTitle || newTitle.trim() === "") {
            return;
        }
        try {
            await apiClient.put(`/game/${get().currentGameId}`,
                { title: newTitle }
            )
            set({ title: newTitle });
        } catch (e) {
            console.error("Error ⚠️: Fail to edit title: ", e)
        }
    },

    turnOffCharacterNotification: () => {
        set({ 
            isCharacterChanged: false,
            title: get().originTitle || get().title,
            originTitle: null,
         })
    },

    // 新增一個只重置「暫時性」遊戲數據的函式
    resetVolatileGameData: () => {
        console.log("Resetting volatile game data (messages, character, etc.)...");
        set({
            messages: [],
            isLoading: false,
            character: null,
            title: null,
            memo: null,
            backgroundImageUrl: null,
            memoSaveStatus: null,
        });
    },

    // clearStore: () => {
    //     console.log("clearing coc game store...")

    //     get().disconnect(); 

    //     // 這裡可以選擇是否也把 formData 清掉
    //     set({
    //         currentGameId: null,
    //         messages: [],
    //         isLoading: false,
    //         character: null,
    //         title: null,
    //         memo: null,
    //         backgroundImageUrl: null,
    //         memoSaveStatus: null,
    //         // formData: {}, // 根據需要決定是否在這裡清理
    //         // hasModal: false,
    //     })
    // }
}),{
        name: 'coc-game-form-storage', // 在 AsyncStorage 中的 key
        
        // 指定儲存引擎
        storage: createJSONStorage(() => AsyncStorage), 

        // **非常重要**: 選擇只儲存您需要的 state
        // 我們不應該儲存像 socket 實例或 isLoading 這種臨時狀態
        partialize: (state) => ({
            formData: state.formData,
            hasModal: state.hasModal,
            // 同時儲存 currentGameId，以便我們知道這個表單是屬於哪個遊戲的
            currentGameId: state.currentGameId,
        }),
    }
))

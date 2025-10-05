import { create } from 'zustand';
import { io } from 'socket.io-client';
import * as SecureStore from "expo-secure-store";
import * as Haptics from 'expo-haptics';

import apiClient from '../api/client';
import { API_CONFIG } from '../api/API';

export const useCOCGameStore = create((set, get) => ({
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
    formData: {
        title: null,
        items: []
    },
    
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
                    title: "new game",
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
                    character: { ...state.character, imageUrl }
                }))
            })

            newSocket.on("message:error", (data) => {
                console.log("Error ⚠️: sever error")
                get().replaceLoadingMessage({ role: "system", newMessage: data.error })
            })

            newSocket.on("formAvailable:received", ({ formData }) => {
                setTimeout(() => {
                    set({
                        formData,
                        isFormModalVisible: true
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

    characterTest: async () => {
        try {
            await apiClient.get(`/game/test/characterUpdate/${get().currentGameId}`)
        } catch (e) {
            console.error("Error⚠️: fail to test character", e)
        }
    },

    openFormModal: () => {
        console.log("open modal")
        set({ 
            isFormModalVisible: true,
            formData: {
                title: "Your Character infor",
                items: [
                    {
                        key: "name",
                        value: "",
                        placeholder: "Your Character Name"
                    },
                    {
                        key: "age",
                        value: "",
                        placeholder: "Your Character age"
                    },{
                        key: "occupation",
                        value: "",
                        placeholder: "Your Character occupation"
                    },
                ]
            }
         })
    },

    closeFormModal: () => set({
        isFormModalVisible: false,
        formData: {
            title: null,
            items: []
        },
    }),

    updateFormData: (fieldName, value) => set((state) => ({
        formData: {...state.formData, [fieldName]: value}
    })),

    comfirmForm: () => {
        const { formData } = get();
        console.log(`Comfirm form:\n${JSON.stringify(formData, null, 2)}`);
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

    clearStore: () => {
        console.log("clearing coc game store...")

        get().disconnect(); 

        set({
            currentGameId: null,
            messages: [],
            isLoading: false,
            character: null,
            title: null,
            memo: null,
            backgroundImageUrl: null,
            memoSaveStatus: null,
        })
    }
}))

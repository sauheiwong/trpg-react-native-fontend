import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
import * as SecureStore from "expo-secure-store";
import * as Haptics from 'expo-haptics';
import analytics from '../config/firebaseConfig';

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
    summary: {},
    sessionStartTime: null,
    
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
                const { message, gameId, tokenUsage } = data;
                set({ 
                    messages: [{
                        _id: Date.now(),
                        role: "model",
                        content: message,
                    }],
                    currentGameId: gameId,
                    isLoading: false,
                    title: "Default Title",
                 })
                console.log(`Manually emiiting "joinGame" for gameId ${gameId}`);
                get().socket.emit("joinGame", gameId);

                if (tokenUsage && tokenUsage.totalTokens) {
                    analytics().logEvent('ai_token_usage', {
                        game_id: get().currentGameId,
                        game_type: 'COC_single',
                        message_type: "game_start",
                        inputTokens: tokenUsage.inputTokens,
                        outputTokens: tokenUsage.outputTokens,
                        totalTokens: tokenUsage.totalTokens
                    });
                }
            });

            newSocket.on("message:received", (data) => {
                const { message, role, tokenUsage } = data;
                console.log("received message");

                get().replaceLoadingMessage({ role, newMessage: message })
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

                if (tokenUsage && tokenUsage.totalTokens) {
                    analytics().logEvent('ai_token_usage', {
                        game_id: get().currentGameId,
                        game_type: 'COC_single',
                        message_type: "normal_response",
                        inputTokens: tokenUsage.inputTokens,
                        outputTokens: tokenUsage.outputTokens,
                        totalTokens: tokenUsage.totalTokens
                    });
                }
            })

            newSocket.on("system:message", (data) => {
                const { message, followingMessage, keepLoading, isError, tokenUsage } = data;

                get().replaceLoadingMessage({ 
                    role: "system", 
                    newMessage: message, 
                    followingMessage, 
                    keepLoading, 
                    isError 
                })

                if (tokenUsage && tokenUsage.totalTokens) {
                    analytics().logEvent('ai_token_usage', {
                        game_id: get().currentGameId,
                        game_type: 'COC_single',
                        message_type: "function_call_args_response",
                        inputTokens: tokenUsage.inputTokens,
                        outputTokens: tokenUsage.outputTokens,
                        totalTokens: tokenUsage.totalTokens
                    });
                }
            })

            newSocket.on("backgroundImage:updated", ({ imageUrl }) => {
                set({ backgroundImageUrl: imageUrl });
                analytics().logEvent("background_update", {
                    game_id: get().currentGameId,
                    game_type: "COC_single",
                })
            })

            newSocket.on("newCharacter:received", ({ newCharacter }) => {
                set({ 
                    character: newCharacter,
                    isCharacterChanged: true,
                    originTitle: get().title,
                    title: "<-- Your New Character",
                 })
                analytics().logEvent("character_update", {
                    game_id: get().currentGameId,
                    game_type: "COC_single",
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
                analytics().logEvent("character_avatar_created", {
                    game_id: get().currentGameId,
                    game_type: "COC_single",
                })
            })

            newSocket.on("message:error", async (data) => {
                console.log("Error ⚠️: sever error")
                get().replaceLoadingMessage({ role: "system", newMessage: data.error })

                await analytics().logEvent("game_error", {
                    error_source: "AI_error",
                    error_message: data.error,
                    game_id: get().currentGameId,
                    game_type: "COC_single",
                })
            })

            newSocket.on("system:error", (data) => {
                const { functionName, error } = data;
                analytics().logEvent("game_error", {
                    error_source: "server_error",
                    functionName: functionName || "missing",
                    error_message: error,
                    game_id: get().currentGameId,
                    game_type: "COC_single",
                })
            })

            newSocket.on("form:prompt", ({ formData }) => {
                setTimeout(() => {
                    set({
                        formData: {...formData, mode: "inputMode"},
                        hasModal: true
                    })
                }, 1000)
                analytics().logEvent("form_created", {
                    game_id: get().currentGameId,
                    game_type: "COC_single",
                })
            })

            newSocket.on("summary:updated", ({ newSummary }) => {
                console.log(`got a new summary`)
                set({ 
                    summary: newSummary,
                    formData: { mode: "viewMode" },
                    hasModal: true,
                })
                analytics().logEvent("summary_update", {
                    game_id: get().currentGameId,
                    game_type: "COC_single",
                })
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

    createNewGame: async ({ new_game_screen }) => {
        const loadingId = Date.now() + 1;

        const loadingMessage = {
            _id: loadingId,
            role: "system",
            content: "Gemini is goona take the equipment🎲"
        }

        set({ 
            messages: [loadingMessage],
            loadingMessageId: loadingId,
            isLoading: true,
        })

        await get().connect(); 
        const socket = get().socket;
        socket.emit("game:create");

        const startTime = Date.now();
        set({ sessionStartTime: startTime });
        // --- ✨ 在這裡記錄事件 ---
        await analytics().logEvent( 'create_game', {
            game_type: "COC_single",
            new_game_screen,
        });
        // ------------------------
    },

    openFormModal: () => {
        set({ 
            isFormModalVisible: get().hasModal,
        })
        analytics().logEvent("open_modal", {
            game_type: "COC_single",
            game_id: get().currentGameId,
            modal_type: get().formData.mode
        })
    },

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
                submitForm[item.displayLabel] = parseInt(item.value, 10)
            })
        }
        sendMessage(JSON.stringify(submitForm, null, 2))
        set({
            formData: { mode: "viewMode" },
            isFormModalVisible: false,
            hasModal: false,
        })

        analytics().logEvent("confirm_form", {
            game_type: "COC_single",
            game_id: get().currentGameId,
        })
    },

    setCurrentGame: async (gameId) => {
        console.log("loading game infor");
        if (!gameId) {
            console.error("Error ⚠️: empty game id");
            return;
        }

        const loadingId = Date.now() + 1;

        const loadingMessage = {
            _id: loadingId,
            role: "system",
            content: "Gemini is goona take the equipment🎲"
        }

        set({ 
            messages: [loadingMessage],
            loadingMessageId: loadingId,
            isLoading: true,
        })
        await get().connect();

        try {
            const response = await apiClient.get(`/game/${gameId}`);
            const data = response.data;
            set({ 
                currentGameId: gameId,
                title: data.game.title,
                messages: data.messages,
                character: data.character,
                memo: data.game.memo,
                backgroundImageUrl: data.game.currentBackgroundImage.imageUrl || null,
                isLoading: false,
                loadingMessageId: null,
            })

            if (data.summary) {
                set({
                    hasModal: true,
                    summary: data.summary.summary,
                    formData: { mode: "viewMode" },
                })
                console.log(`got a summary`)
            }

            const socket = get().socket;
            if (socket && socket.connected) {
                console.log(`Manually emiiting "joinGame" for gameId ${gameId}`);
                socket.emit("joinGame", gameId);
            }
            const startTime = Date.now();
            set({ sessionStartTime: startTime });
            // --- ✨ 在這裡記錄事件 ---
            await analytics().logEvent('load_game', {
                game_type: "COC_single",
                game_id: gameId,
            });
            // ------------------------
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
        analytics().logEvent("reload_game", {
            game_type: "COC_single",
            game_id: get().currentGameId,
        })
    },

    sendMessage: async (userMessage) => {
        if (!userMessage || userMessage.trim() === "") {
            return;
        }
        console.log(`user message is: ${userMessage}`)
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

        // if (userMessage.startsWith("/roll")) {
        //     const diceString = userMessage.substring("/roll ".length).trim();
        //     if (!diceString) return;

        //     // --- ✨ 在這裡記錄擲骰事件 ---
        //     await analytics().logEvent( 'roll_dice', {
        //         dice_string: diceString,
        //         game_id: get().currentGameId
        //     });
        //     // --------------------------

        //     try {
        //         const response = await apiClient.post("/roll", {
        //             dice: diceString,
        //             gameId: get().currentGameId
        //         })
        //         console.log(`roll dice response.message is: ${response.message}`)
        //         await get().sendMessage(response.message)

        //     } catch (error){
        //         console.error(`Error ⚠️: fail to roll a dice: ${error}`)
        //         // --- ✨ 在這裡記錄錯誤事件 ---
        //         await analytics().logEvent( 'game_error', {
        //             error_source: 'roll_dice_api',
        //             error_message: error.message // 記錄錯誤訊息
        //         });
        //         // --------------------------
        //         get().replaceLoadingMessage({ 
        //             role: "system", 
        //             message: "Error ⚠️: fail to roll a dice",
        //             isError: true,
        //         })
        //     }
        //     return;
        // }

        // --- ✨ 在這裡記錄發送訊息事件 ---
        await analytics().logEvent( 'send_message', {
            message_length: userMessage.length,
            game_id: get().currentGameId
        });
        // ------------------------------

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

            analytics().logEvent("edit_title", {
                game_type: "COC_single",
                game_id: get().currentGameId,
            })
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
        analytics().logEvent("turn_off_character_notification", {
            game_type: "COC_single",
            game_id: get().currentGameId,
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
            summary: {},
            hasModal: false,
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

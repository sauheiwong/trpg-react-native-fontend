import { create } from 'zustand';
import { io } from 'socket.io-client';

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
    
    // Action
    
    replaceLoadingMessage: ({ role, newMessage, keepLoading, followingMessage, isError }) => {
        const loadingId = get().loadingMessageId;
        set((state) => ({
            messages: state.messages.map(message =>
                message._id === loadingId
                ? { ...message, role, content: newMessage }
                : message
            ),
            isLoading: keepLoading,
            loadingMessageId: keepLoading ? loadingId : null,
        }))
        if (role === "system" && !isError) {
            const loadingMessageId = Date.now();
            set((state) => ({
                messages: [...state.message, {
                    _id: loadingMessageId,
                    role: "system",
                    content: followingMessage,
                }],
                isLoading: true,
                loadingMessageId,
            }))
        }
    },
    // Socket

    connect: (gameId) => {
        console.log(`Attempting to connect to game room: ${gameId}`);

        if (get().socket) {
            get().socket.disconnect();
        }

        const newSocket = io(API_CONFIG.SOCKET_URL, {
            query: { gameId }
        })

        newSocket.on("connect", () => {
            console.log("Socket connected successfully! ID: ", newSocket.id);
        })

        newSocket.on("message:received", (data) => {
            const { message, role } = data;
            console.log(`Event, 'message:received' received: ${message} with role: ${role}`);

            get().replaceLoadingMessage({ role, newMessage: message })
        })

        newSocket.on("systemMessage:received", (data) => {
            const { message, followingMessage, keepLoading, isError } = data;
            console.log(`Event, 'ystemMessage:received' received: ${message}`);

            get().replaceLoadingMessage({ 
                role: "system", 
                message, 
                followingMessage, 
                keepLoading, 
                isError 
            })
        })

        newSocket.on("disconnect", () => {
            console.log("Socket disconnected.")
        })

        set({ socket: newSocket });
    },

    disconnect: () => {
        if (get().socket) {
            get().socket.disconnect();
            set({ socket: null })
        }
    },

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
             get().connect();
        } catch (e) {
            console.error(`Error ⚠️: fail to fetch game with id: ${gameId}: ${e.messages}`);
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
            cotent: "Gemini is reading your message..."
        }

        set((state) => ({ 
            messages: [...state.messages, newMessage, loadingMessage],
            loadingMessageId: loadingId,
            isLoading: true,
        }))

        socket.emit("sendMessage", {
            gameId: currentGameId,
            message: userMessage,
        })
    },

    clearStore: () => {
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

import React, { useState } from 'react';
import { Modal, View, ScrollView, Pressable, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from "@expo/vector-icons";
import CustomButton from "./CustomButton";
import FormPoint from './FormPoint';

import { useCOCGameStore } from '../stores/COCGameStore';
import { COLORS } from '../constants/color';

const COCFormModal = () => {
    // Get state and actions from the Zustand store
    const isFormModalVisible = useCOCGameStore((state) => state.isFormModalVisible);
    const formData = useCOCGameStore((state) => state.formData);
    const updateFormData = useCOCGameStore((state) => state.updateFormData);
    const comfirmForm = useCOCGameStore((state) => state.comfirmForm);
    const closeModal = useCOCGameStore((state) => state.closeFormModal);

    const totalAvailablePoint = formData.point?.value || 0;
    const [availablePoint, setAvailablePoint] = useState(0)

    const updateData = (key, text) => {
        updateFormData(key, text)
    }

    const availablePointHandler = () => {
        const totalUsedPoint = Object.values(formData.items).reduce((total, item) => {
            if (item.key !== "LUCK") {
                const numericValue = parseInt(item.value, 10) || 15;
                return total + numericValue
            }
            return total;
        }, 0)
        setAvailablePoint(totalAvailablePoint - totalUsedPoint)
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isFormModalVisible}
            onRequestClose={closeModal} // Allows closing with Android back button
        >
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.centeredView}
            >
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>{formData.title || "Nothing Here"}</Text>
                    
                    {Object.entries(formData.items).map(([key, item]) => <FormPoint name={key} item={item} handler={availablePointHandler} key={key} />)}
                    <CustomButton
                        title="Confirm"
                        onPress={() => comfirmForm()}
                    />
                    <Pressable 
                        onPress={closeModal} 
                        style={{position: 'absolute', top: 5, right: 5, padding: 5}}>
                        <Feather name="x" size={24} color="white" />
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background
    },
    modalView: {
        width: '85%',
        backgroundColor: COLORS.background,
        borderRadius: 20,
        padding: 25,
        alignItems: 'stretch', // Changed from 'center' to stretch inputs
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
});

export default COCFormModal;
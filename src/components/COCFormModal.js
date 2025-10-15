import React, { useEffect, useState } from 'react';
import { Modal, View, ScrollView, Pressable, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from "@expo/vector-icons";
import CustomButton from "./CustomButton";
import FormPoint from './FormPoint';

import { useCOCGameStore } from '../stores/COCGameStore';
import { COLORS } from '../constants/color';

const COCFormModal = () => {
    // Get state and actions from the Zustand store
    const isFormModalVisible = useCOCGameStore((state) => state.isFormModalVisible);
    const formData = useCOCGameStore((state) => state.formData);
    const updateFormDataItem = useCOCGameStore((state) => state.updateFormDataItem);
    const confirmForm = useCOCGameStore((state) => state.confirmForm);
    const closeModal = useCOCGameStore((state) => state.closeFormModal);
    const summary = useCOCGameStore((state) => state.summary);

    const totalAvailablePoint = formData.point?.value || 0;
    const [availablePoint, setAvailablePoint] = useState(0)

    const availablePointHandler = () => {
        const totalUsedPoint = Object.values(formData.items).reduce((total, item) => {
            if (item.displayLabel !== "LUCK") {
                const numericValue = parseInt(item.value, 10) || 15;
                return total + numericValue
            }
            return total;
        }, 0)
        setAvailablePoint(totalAvailablePoint - totalUsedPoint || 0)
    }

    const updateData = (key, text) => {
        updateFormDataItem(key, text);
        availablePointHandler()
    }

    useEffect(() => {
        if (formData.items) {
            availablePointHandler()
        }
    }, [formData])

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isFormModalVisible}
            onRequestClose={closeModal} // Allows closing with Android back button
        >
            <View style={styles.centeredView}>
                <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingContainer} // <--- 使用新的樣式
                >
                    <View style={styles.modalView}>
                        { formData.mode === "inputMode" ? 
                        <>
                            <Text style={styles.modalTitle}>{formData.title || "Nothing Here"}</Text>

                            <Text style={styles.modalTitle}>AvailablePoint: {availablePoint} / {totalAvailablePoint}</Text>
                            
                            <View style={styles.contentContainer}>
                                <ScrollView>
                                    {formData.items && 
                                    Object.entries(formData.items).map(([key, item]) => <FormPoint name={key} item={item} handler={updateData} key={key} />)}
                                </ScrollView>
                            </View>
                            <View style={styles.buttonContainer}>
                                <CustomButton
                                    title="Confirm"
                                    onPress={() => confirmForm()}
                                />
                            </View>
                        </>
                        :
                        <>
                            <Text style={styles.modalTitle}>Summary</Text>
                            <ScrollView>
                                {summary.goldenFacts && 
                                <>
                                    <Text style={styles.summaryTitle}>Golden Facts:</Text>
                                    <Text style={styles.summaryContent}>{summary.goldenFacts.map((item) => "-- "+item+'\n\n')}</Text>
                                </>}
                                {summary.recentEvents && 
                                <>
                                    <Text style={styles.summaryTitle}>Recent Facts:</Text>
                                    <Text style={styles.summaryContent}>{"-- "+summary.recentEvents+'\n'}</Text>
                                </>}
                                {summary.npcDescription && 
                                <>
                                    <Text style={styles.summaryTitle}>NPC Description:</Text>
                                    <Text style={styles.summaryContent}>{summary.npcDescription.map((item) => `\n-- ${item.name}:\n${item.description}`)}</Text>
                                </>}
                            </ScrollView>
                        </>
                        }
                        <Pressable
                            onPress={closeModal}
                            style={{position: 'absolute', top: 5, right: 5, padding: 5}}
                        >
                            <Feather name="x" size={24} color="white" />
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </View>
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
    keyboardAvoidingContainer: {
        width: '100%',
        alignItems: 'center', // 確保內部的 modalView 水平居中
    },
    modalView: {
        width: '85%',
        height: '90%',
        backgroundColor: COLORS.background,
        borderRadius: 20,
        padding: 25,
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
    contentContainer: {
        maxHeight: "70%"
    },
    buttonContainer: {
        marginBottom: 40,
    },
    summaryTitle: {
        fontSize: 16,
        color: COLORS.tips,
        fontWeight: "bold",
        marginBottom: 10,
    },
    summaryContent: {
        fontSize: 14,
        color: COLORS.text,
    },

});

export default COCFormModal;
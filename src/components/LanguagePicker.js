// components/LanguagePicker.js
import React, { useState } from 'react';
import { View, StyleSheet, Text, Platform, TouchableOpacity, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../constants/color'; // Assuming your color constants are here

// Define the language options with labels and I18n codes
const languageOptions = [
    { label: '請選擇語言...', value: '' }, // A placeholder option
    { label: 'English', value: 'en' },
    { label: '繁體中文', value: 'zh-Hant' },
    { label: '简体中文', value: 'zh-Hans' },
    { label: '日本語', value: 'ja' },
    { label: 'Español', value: 'es' },
    { label: 'Français', value: 'fr' },
    { label: 'Deutsch', value: 'de' },
];

const LanguagePicker = ({ selectedValue, onValueChange }) => {
    // State to control the modal visibility on iOS
    const [modalVisible, setModalVisible] = useState(false);

    // Find the label of the currently selected language to display on the button
    const selectedLabel = languageOptions.find(opt => opt.value === selectedValue)?.label || '請選擇語言...';

    // --- iOS Specific UI ---
    if (Platform.OS === 'ios') {
        return (
            <View style={styles.container}>
                <Text style={styles.label}>Language:</Text>
                <TouchableOpacity 
                    style={styles.iosPickerButton} 
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.iosPickerButtonText}>{selectedLabel}</Text>
                </TouchableOpacity>
                
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Picker
                                selectedValue={selectedValue}
                                onValueChange={(itemValue) => {
                                    onValueChange(itemValue);
                                    // You can optionally close the modal immediately after selection
                                    // setModalVisible(false);
                                }}
                                style={styles.iosPicker}
                            >
                                {languageOptions.map((lang) => (
                                    <Picker.Item key={lang.value} label={lang.label} value={lang.value} />
                                ))}
                            </Picker>
                            <TouchableOpacity 
                                style={styles.doneButton} 
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.doneButtonText}>完成</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

    // --- Android Specific UI (Original Code) ---
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Language:</Text>
            <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={selectedValue}
                    onValueChange={onValueChange}
                    style={styles.picker}
                    dropdownIconColor={COLORS.text}
                >
                    {languageOptions.map((lang) => (
                        <Picker.Item key={lang.value} label={lang.label} value={lang.value} />
                    ))}
                </Picker>
            </View>
        </View>
    );
};

// Add new styles for the modal and iOS button
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    label: {
        color: COLORS.text,
        fontSize: 15,
        flex: 1,
    },
    // Android styles
    pickerWrapper: {
        flex: 2,
        backgroundColor: COLORS.highlight1,
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
    },
    picker: {
        color: COLORS.text,
    },
    // iOS styles
    iosPickerButton: {
        flex: 2,
        backgroundColor: COLORS.highlight1,
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        paddingHorizontal: 15,
    },
    iosPickerButtonText: {
        color: COLORS.text,
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#333', // A dark background for the picker view
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 10,
        paddingBottom: 50,
    },
    iosPicker: {
        // On iOS, the picker text color is controlled by the itemStyle prop on Picker.Item,
        // but for simplicity, we'll let it be the default dark text on a light background.
        // For a dark theme picker, more advanced styling or a different library might be needed.
        color:'white', // Set text color to white for iOS picker wheel
    },
    doneButton: {
        marginTop: 10,
        padding: 15,
        backgroundColor: COLORS.highlight1, // An iOS-style blue button
        borderRadius: 10,
        alignItems: 'center',
    },
    doneButtonText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LanguagePicker;
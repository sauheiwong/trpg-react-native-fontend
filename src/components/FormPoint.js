import React from 'react';
import { Text, View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/color';

// Correctly destructure props from a single object
const FormPoint = ({name, item, handler}) => {
    const { displayLabel, value, minValue, maxValue, keyboardType, editable, placeholder } = item;

    /**
     * Handles text changes in real-time.
     * This function ensures that only numeric characters can be entered.
     */
    const handleTextChange = (text) => {
        // Use a regular expression to allow only numbers (or an empty string)
        if (/^[0-9]*$/.test(text)) {
            handler(name, text);
        }
    };

    /**
     * Handles the blur event (when the input loses focus).
     * This function validates the number against minValue and maxValue and corrects it if necessary.
     */
    const handleBlur = () => {
        const numericValue = parseInt(value, 10);

        // If the value is not a number (e.g., empty string), reset to minValue
        if (isNaN(numericValue)) {
            handler(name, String(minValue));
            return;
        }

        // Clamp the value within the min/max range
        if (numericValue > maxValue) {
            handler(name, String(maxValue));
        } else if (numericValue < minValue) {
            handler(name, String(minValue));
        }
    };

    /**
     * Handles the increment button press.
     * Increases the value by 1, respecting the maxValue.
     */
    const handleIncrement = () => {
        const numericValue = isNaN(parseInt(value, 10)) ? minValue : parseInt(value, 10);
        if (numericValue < maxValue) {
            handler(name, String(numericValue + 1));
        }
    };

    /**
     * Handles the decrement button press.
     * Decreases the value by 1, respecting the minValue.
     */
    const handleDecrement = () => {
        const numericValue = isNaN(parseInt(value, 10)) ? minValue : parseInt(value, 10);
        if (numericValue > minValue) {
            handler(name, String(numericValue - 1));
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.label}>{displayLabel}</Text>
            
            <View style={styles.controlsContainer}>
                {/* Decrement Button */}
                <TouchableOpacity onPress={handleDecrement}
                style={styles.button} 
                disabled={!editable}>
                    <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.tips}
                    value={String(value)} // Ensure value is always a string
                    keyboardType={keyboardType || "numeric"}
                    onChangeText={handleTextChange}
                    onBlur={handleBlur}
                    editable={editable}
                    selectTextOnFocus
                />

                {/* Increment Button */}
                <TouchableOpacity onPress={handleIncrement} style={styles.button} disabled={!editable}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Updated styles for the new layout
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',       // Arrange items horizontally
        alignItems: 'center',       // Vertically align items to the center
        justifyContent: 'space-between', // Push label and controls to opposite ends
        paddingVertical: 8,         // Add some vertical spacing
        marginHorizontal: 10,       // Add some horizontal margin
    },
    label: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1, // Allow label to take up available space
    },
    controlsContainer: {
        flexDirection: 'row',       // Arrange button-input-button horizontally
        alignItems: 'center',       // Vertically align them
    },
    button: {
        width: 30,
        height: 30,
        borderRadius: 20,           // Make it circular
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.highlight1,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 26, // Fine-tune vertical alignment of the text
    },
    input: {
        backgroundColor: COLORS.highlight1,
        color: COLORS.text,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        fontSize: 15,
        fontWeight: 'bold',
        width: 60,                  // Give the input a fixed width
        textAlign: 'center',        // Center the number inside
        marginHorizontal: 10,       // Space between input and buttons
    }
});

export default FormPoint;
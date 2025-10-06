import React from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../constants/color';

// Correctly destructure props from a single object
const FormPoint = ({name, item, handler}) => {
    // The props are now nested under 'form' as you passed them, which is a bit unusual.
    // A more common pattern would be to pass item directly, e.g., <FormPoint item={...} />
    // But based on your current structure, we'll use form.item.
    // console.log(`${JSON.stringify(item, null, 2)}`)
    const key = name;
    const { value, minValue, maxValue, keyboardType, editable, placeholder } = item;

    /**
     * Handles text changes in real-time.
     * This function ensures that only numeric characters can be entered.
     */
    const handleTextChange = (text) => {
        // Use a regular expression to allow only numbers (or an empty string)
        if (/^[0-9]*$/.test(text)) {
            handler(key, text);
        }
    };

    /**
     * Handles the blur event (when the input loses focus).
     * This function validates the number against minValue and maxValue and corrects it if necessary.
     */
    const handleBlur = () => {
        // Convert the current value from string to number
        const numericValue = parseInt(value, 10);

        // If the value is not a number (e.g., empty string), reset to minValue
        if (isNaN(numericValue)) {
            handler(key, String(minValue));
            return;
        }

        // If the value is greater than the max, clamp it to the max value
        if (numericValue > maxValue) {
            handler(key, String(maxValue));
        } 
        // If the value is less than the min, clamp it to the min value
        else if (numericValue < minValue) {
            handler(key, String(minValue));
        }
    };

    return (
        <>
            <Text style={styles.label}>{key}</Text>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={COLORS.tips}
                value={String(value)} // Ensure value is always a string
                keyboardType={keyboardType || "default"}
                onChangeText={handleTextChange} // Use our real-time filter
                onBlur={handleBlur} // Use our validation on blur
                editable={editable}
                selectTextOnFocus // A nice UX touch for numeric inputs
            />
        </>
    );
};

// You'll need to define your styles here
const styles = StyleSheet.create({
    label: {
        // Your label styles
        color: 'white',
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        // Your input styles
        backgroundColor: '#B22222', // Example: Dark red
        color: 'white',
        borderRadius: 10,
        padding: 15,
        fontSize: 18,
        fontWeight: 'bold',
    }
});

export default FormPoint;
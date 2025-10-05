import React from 'react';
import { Text, TextInput, StyleSheet} from 'react-native';

import { COLORS } from '../constants/color';


const FormInput = (form, handler) => {
    // console.log(`form:\n${JSON.stringify(form, null, 2)}`)
    const {key, value, placeholder} = form.item;
    return (
        <>
            <Text style={styles.label}>{key}</Text>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={COLORS.tips}
                value={value || ""}
                onChangeText={(text) => handler(key, text)}
            />
        </>
    )
}

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        color: COLORS.text,
        marginBottom: 5,
        alignSelf: 'flex-start', // Align labels to the left
    },
    input: {
        width: '100%',
        height: 45,
        backgroundColor: COLORS.highlight1,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        color: COLORS.text,
        marginBottom: 15,
    },
});

export default FormInput;


import React, { useMemo } from "react"
import { TextInput, View } from "react-native"
import { Icon } from "react-native-elements"
// import { Icon } from '../components';
import { Controller } from 'react-hook-form';
import { Text } from "react-native";
import { shadow } from "../constants/layout";
import { colors } from "../constants";

export default CustomInput = ({
    style,
    label,
    containerStyle,
    textInputProps,
    controllerProps,
    iconProps
}) => {

    return (
        <View style={containerStyle}>
            {label &&
                <Text
                    style={{ fontSize: 16, color: Colors.black, fontWeight: 'bold' }}>
                    {label}
                </Text>
            }
            <Controller
                {...controllerProps}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={[{ flexDirection: 'row', backgroundColor: colors.veryLightGrey + 50, borderRadius: 12, alignItems: 'center', paddingRight: 12, borderWidth: 2, borderColor: colors.lightGray }, style]} >

                        <TextInput
                            placeholderTextColor={colors.lightGray}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            {...textInputProps}
                            style={[{ paddingHorizontal: 16, flex: 1, marginRight: 5, fontSize: 16, color: 'black', height: 50, justifyContent: 'center' }]} />
                        {iconProps && <Icon color="#aaa" {...iconProps} />}
                        {/* {iconProps && <Icon size={20} {...iconProps} color={colors.gray} />} */}
                    </View>
                )}
            />
            <Error error={controllerProps.errors[controllerProps.name]} label={label ? label : textInputProps.placeholder} />
        </View>

    )
}

const Error = ({ error, label }) => {
    if (!error) return null;
    const capitalizeFistLetter = string => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    const errorText = useMemo(() => {
        if (error.type == 'pattern') return `Please enter a valid ${label.toLowerCase()}`;
        if (error.type == 'max') return error.message;
        if (error.type == 'required') return `${capitalizeFistLetter(label)} is required`;
    }, [error]);
    return <Text style={{ color: 'red' }}>{errorText}</Text>;
};


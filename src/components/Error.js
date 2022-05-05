import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { useNetInfo } from "@react-native-community/netinfo";
import { colors } from '../constants';

const Error = ({ retry, message, color = 'black', opacity = 0.1, small, retryLabel, retryIcon, icon }) => {
    const netInfo = useNetInfo();

    return (
        <View style={{ alignItems: 'center', padding: 20 }}>
            {!small && <Icon color={color} style={{ opacity: opacity }} size={70} name={icon || (netInfo.isConnected == false ? 'perm-scan-wifi' : 'list-alt')} />}
            <Text style={{ fontSize: 24, fontWeight: "bold", opacity: opacity, color: color, textAlign: "center" }}>
                {netInfo.isConnected == false ? 'No Internet Connection' : message}
            </Text>
            {retry && (
                <TouchableOpacity onPress={retry} style={{ alignItems: 'center', paddingTop: 15 }}>
                    <Icon
                        color={colors.primary}
                        containerStyle={{ opacity: 0.8, borderRadius: 30, borderWidth: 2, borderColor: colors.primary, backgroundColor: '#eee', padding: 5 }}
                        size={40}
                        name={retryIcon ? retryIcon : "refresh"}
                    />
                    <Text style={{ fontSize: 16, opacity: 0.8, color: colors.primary }}>{retryLabel ? retryLabel : 'Retry'}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default Error;

import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { Modal } from 'react-native'
import { TouchableOpacity } from 'react-native'
import DatePicker from 'react-native-date-picker'
import { colors } from '../constants'

export default DateModal = ({ dismiss, confirm, value, initialDate }) => {
    const [date, setDate] = useState(value || initialDate || new Date())

    const onConfirm = () => {
        confirm(date)
        dismiss()
    }
    return (
        <View >
            <Modal
                transparent={true}
                hardwareAccelerated
                statusBarTranslucent
                animationType="fade">
                <TouchableOpacity activeOpacity={1} onPress={dismiss} style={{ flex: 1, backgroundColor: "#00000080", alignItems: 'center', justifyContent: 'center' }} >
                    <TouchableOpacity activeOpacity={1} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: 15, padding: 10, position: 'absolute' }}>
                        <DatePicker
                            maximumDate={new Date()}
                            androidVariant="nativeAndroid"
                            mode="date"
                            date={date}
                            onDateChange={setDate}
                            style={{ width: 250 }}
                        />
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={dismiss} style={{ padding: 10, borderRadius: 5, flex: 1, borderWidth: 2, borderColor: colors.primary + '50' }}>
                                <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Cancel</Text>
                            </TouchableOpacity>
                            <View style={{ width: 10 }} />
                            <TouchableOpacity onPress={onConfirm} style={{ backgroundColor: colors.primary, padding: 10, borderRadius: 5, flex: 1 }}>
                                <Text style={{ fontWeight: 'bold', textAlign: 'center', color: 'white' }}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    )
}

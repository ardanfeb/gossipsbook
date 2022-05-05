import React, { } from 'react';
import { Text, TouchableOpacity, Modal, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';


const AddPostModal = ({ visible, dismiss }) => {
    const navigation = useNavigation()
    const windowDimensions = useWindowDimensions()

    const onCreatePost = () => {
        navigation.navigate('Add')
        dismiss()
    }

    const onCreatePoll = () => {
        navigation.navigate('Create Poll')
        dismiss()
    }

    return (
        <Modal
            transparent={true}
            hardwareAccelerated
            visible={visible}
            onRequestClose={dismiss}
            statusBarTranslucent
            animationType="fade">
            <TouchableOpacity activeOpacity={1} onPress={dismiss} style={{ flex: 1, backgroundColor: "#00000080", alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 100 }} >
                <TouchableOpacity onPress={onCreatePost} activeOpacity={.6} style={{ backgroundColor: 'white', borderRadius: 10, width: '85%', maxHeight: windowDimensions.height * .75, overflow: 'hidden', alignItems: 'center', padding: 15, marginTop: 15 }}>
                    <Icon containerStyle={{ borderRadius: 100, borderWidth: 2, borderColor: "#ccc", padding: 15 }} name="add" color="#ccc" size={25} />
                    <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: "#999", paddingTop: 10 }} >Create Post</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onCreatePoll} activeOpacity={.6} style={{ backgroundColor: 'white', borderRadius: 10, width: '85%', maxHeight: windowDimensions.height * .75, overflow: 'hidden', alignItems: 'center', padding: 15, marginTop: 15 }}>
                    <Icon containerStyle={{ borderRadius: 100, borderWidth: 2, borderColor: "#ccc", padding: 15 }} name="collections" color="#ccc" size={25} />
                    <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: "#999", paddingTop: 10 }} >Create Photo Poll</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    )
}

export default AddPostModal
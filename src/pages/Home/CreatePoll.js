import React, { useContext, useMemo, useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View, TextInput, Alert } from 'react-native'
import { Icon } from 'react-native-elements'
import { launchImageLibrary } from 'react-native-image-picker'
import { colors } from '../../constants'
import { useNavigation } from '@react-navigation/native';
import { PollContext } from '../../context/PollProvider'

const CreatePoll = () => {
    const navigation = useNavigation()
    const [visibility, setVisibility] = useState('Everyone')
    const [photo1, setPhoto1] = useState()
    const [photo2, setPhoto2] = useState()
    const [description, setDescription] = useState('')
    const { newPhotoPoll, responseTypes } = useContext(PollContext)
    const [response_type, setResponseType] = useState(responseTypes[0]?.id)

    const onPhoto1Selected = res => {
        if (!res || res.didCancel) return
        setPhoto1(res.assets[0])
    }
    const onPhoto2Selected = res => {
        if (!res || res.didCancel) return
        setPhoto2(res.assets[0])
    }

    const onSubmit = () => {
        if (!photo1) return Alert.alert('Submit', 'Please select photo 1 to continue.')
        if (!photo2) return Alert.alert('Submit', 'Please select photo 2 to continue.')
        newPhotoPoll({ photo1, photo2, response_type, friends_only: visibility == 'Only Friends', description }, () => navigation.goBack())
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }} >
            <Header />
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
                <ChoiceView choices={['Everyone', 'Only Friends']} label="Who is able to see your post" setChoice={setVisibility} selectedChoice={visibility} />

                <Text style={{ fontSize: 16, paddingBottom: 5, paddingTop: 15, color: 'black' }} >Photos</Text>
                <View style={{ borderRadius: 8, alignItems: 'center', height: 150, borderColor: '#ccc', borderWidth: 2, flexDirection: 'row', overflow: 'hidden', marginBottom: 20 }}>
                    <TouchableOpacity onPress={() => launchImageLibrary({}, onPhoto1Selected)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 150, position: 'relative', backgroundColor: photo1 ? 'black' : 'white' }}>
                        {photo1 && <Image style={{ height: 148, top: 0, left: 0, bottom: 0, position: 'absolute', borderColor: colors.gray, opacity: .8, width: '100%' }} source={photo1} />}
                        <Icon name="perm-media" size={28} color={photo1 ? 'white' : colors.gray + '75'} />
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: photo1 ? 'white' : colors.gray + '75' }} >Photo 1</Text>
                    </TouchableOpacity>
                    <View style={{ width: 2, height: 150, backgroundColor: photo1 ? '#ffffff75' : "#ccc" }} />
                    <TouchableOpacity onPress={() => launchImageLibrary({}, onPhoto2Selected)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 150, backgroundColor: photo2 ? 'black' : 'white' }}>
                        {photo2 && <Image style={{ height: 148, top: 0, left: 0, bottom: 0, position: 'absolute', borderColor: colors.gray, opacity: .8, width: '100%' }} source={photo2} />}

                        <Icon name="perm-media" size={28} color={photo2 ? 'white' : colors.gray + '75'} />
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: photo2 ? 'white' : colors.gray + '75' }} >Photo 2</Text>
                    </TouchableOpacity>
                </View>

                <ChoiceView labelStyle={{ fontSize: 24 }} choices={responseTypes.map(res => res.emoji)} label="Select emoji" setChoice={emoji => setResponseType(responseTypes.find(r => r.emoji == emoji).id)} selectedChoice={responseTypes.find(r => r.id == response_type).emoji} />

                <Text style={{ fontSize: 16, paddingBottom: 5, paddingTop: 20 }} >Caption</Text>
                <TextInput
                    multiline
                    value={description}
                    onChangeText={setDescription}
                    style={{ borderColor: '#ccc', borderRadius: 10, borderWidth: 1, textAlignVertical: 'top', paddingHorizontal: 12, minHeight: 150 }}
                    placeholder='Caption for the poll' />
            </ScrollView>
            <View style={{ padding: 15, borderTopWidth: 1, borderColor: '#ccc' }} >
                <TouchableOpacity onPress={onSubmit} style={{ borderRadius: 10, padding: 15, backgroundColor: colors.primary }} >
                    <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 16, textAlign: 'center' }} >Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CreatePoll

const Header = () => {
    const navigation = useNavigation()
    return (
        <TouchableOpacity onPressIn={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#ccc' }} >
            <Icon iconStyle={{ paddingLeft: 14, marginRight: -4 }} containerStyle={{ borderColor: 'black', borderWidth: 1, borderRadius: 100, padding: 10, paddingLeft: 0 }} name="arrow-back-ios" />
            <Text style={{ fontSize: 22, fontWeight: 'bold', flex: 1, textAlign: 'center', position: 'absolute', right: 0, left: 0 }} >Create Poll</Text>
        </TouchableOpacity>
    )
}

const ChoiceView = ({ label, choices, setChoice, selectedChoice, labelStyle }) => {
    const Btn = ({ label }) => {
        const selected = useMemo(() => label == selectedChoice, [selectedChoice])
        const onPress = () => {
            setChoice(label)
        }
        return (
            <TouchableOpacity style={{ backgroundColor: selected ? colors.primary : '#eee', padding: 15, flex: 1 }} onPress={onPress} >
                <Text style={[{ fontWeight: 'bold', color: selected ? '#fff' : '#000', fontSize: 16, textAlign: 'center' }, labelStyle]} >{label}</Text>
            </TouchableOpacity>
        )
    }
    return (
        <View>
            <Text style={{ fontSize: 16, paddingBottom: 5 }} >{label}</Text>
            <View style={{ borderRadius: 10, flexDirection: 'row', overflow: 'hidden', borderWidth: 1, borderColor: colors.primary + '30', borderStyle: 'dashed' }}>
                {choices.map((item, index) => <Btn label={item} key={index} />)}
            </View>
        </View>
    )
}
import { useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, View, TouchableOpacity, Text, DeviceEventEmitter } from 'react-native'
import { Icon } from 'react-native-elements'
import Error from '../../components/Error'
import PollItem from '../../components/PollItem'
import { colors } from '../../constants'
import { LOADING, PollContext, POLL_EVENTS } from '../../context/PollProvider'

const PollList = ({ route }) => {

    const own = route?.params?.own
    const friend = route?.params?.friend
    const { getPhotoPollList } = useContext(PollContext)
    const [state, setState] = useState({ page: 1, list: [], loading: true, hasLoadedAllItems: false })

    useEffect(() => {
        getPhotoPollList(setState, { page: state.page, own, friend })
        const newPollListener = DeviceEventEmitter.addListener(POLL_EVENTS.NEW_POLL_ADDED, () => getPhotoPollList(setState, { page: 1, own, friend }))
        return () => newPollListener.remove()
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <Header />
            <FlatList
                data={state.list}
                ListEmptyComponent={() => !state.loading && <Error message="No Photo Polls Found" />}
                contentContainerStyle={{ padding: 15, flexGrow: 1, backgroundColor: 'white' }}
                ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                ListFooterComponent={() => !state.hasLoadedAllItems && <ActivityIndicator color={colors.primary} size={'large'} style={{ alignSelf: 'center', padding: 20 }} />}
                onEndReachedThreshold={0.1}
                onEndReached={() => (!state.loading && !state.hasLoadedAllItems) ? getPhotoPollList(setState, { page: state.page, own, friend }) : null}
                renderItem={({ item, index }) => <PollItem item={item} />} />
        </View>
    )
}

export default PollList

const Header = () => {
    const navigation = useNavigation()
    return (
        <TouchableOpacity onPressIn={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#ccc' }} >
            <Icon iconStyle={{ paddingLeft: 14, marginRight: -4 }} containerStyle={{ borderColor: 'black', borderWidth: 1, borderRadius: 100, padding: 10, paddingLeft: 0 }} name="arrow-back-ios" />
            <Text style={{ fontSize: 22, fontWeight: 'bold', flex: 1, textAlign: 'center', position: 'absolute', right: 0, left: 0 }} >Photo Polls</Text>
        </TouchableOpacity>
    )
}

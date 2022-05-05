import React, { useCallback, useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';


const YoutubePlayerScreen = (props) => {

    const { videoId } = props

    const [playing, setPlaying] = useState(false);

    const togglePlaying = useCallback(() => {
        setPlaying((prev) => !prev);
    }, []);

    return (
        <Pressable
            onPress={() => {
                if (!playing) {
                    setPlaying(true);
                }
            }}
        >
            <View
                pointerEvents={undefined}
                style={{ width: '100%', height: 400 }}
            >
                <YoutubePlayer
                    height={400}
                    width={'100%'}
                    play={playing}
                    videoId={videoId}
                    webViewProps={{
                        androidLayerType: 'hardware',
                        scrollEnabled: false,
                    }}
                    onChangeState={event => {
                        if (event === 'paused') {
                            setPlaying(false);
                        }
                    }}
                />
            </View>
        </Pressable>
    );
}

export default YoutubePlayerScreen;

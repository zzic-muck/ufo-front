import React, {useEffect, useState} from 'react';
import {Animated, Image, TouchableOpacity, View} from 'react-native';

const Sadari = ({cnt}) => {
    const [positions, setPositions] = useState([]); // 각 이미지의 애니메이션 값을 저장
    const [horizontalLines, setHorizontalLines] = useState([]);

    const imageUriArray = ['https://i.namu.wiki/i/NB_qC6YRjH7hv6elNznBIBOBZ5AwE-PKYEWKcU03aFzGsc60bOt9KLxocyvB01OxAbOG8joW9mgkShFmTaTKsQ.webp'];

    useEffect(() => {
        const newPositions = Array(cnt).fill().map(() => new Animated.Value(0));
        setPositions(newPositions);

        // 각 세로선 사이에 가로선 위치를 랜덤하게 설정
        const newHorizontalLines = Array(cnt - 1).fill().map(() => Math.random() * 300 + 100);
        setHorizontalLines(newHorizontalLines);

    }, [cnt]);

    // 이미지를 아래로 움직이는 함수
    const moveImage = index => {
        Animated.timing(positions[index], {
            toValue: 500, // 이미지를 얼마나 더 아래로 움직일지
            duration: 500, // 애니메이션 지속 시간
            useNativeDriver: true
        }).start();
    };

    return (
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {positions.map((position, i) => (
                <View key={`player-${i}`} style={{position: 'relative', alignItems: 'center', marginBottom: 10}}>
                    <View style={{
                        position: 'absolute',
                        width: 10,
                        height: 400,
                        backgroundColor: 'black',
                        marginLeft: 50 * (i + 1),
                        top: 110
                    }}/>

                    {i < cnt - 1 && (
                        <View style={{
                            position: 'absolute',
                            width: 100, // 세로선 사이의 간격
                            height: 10,
                            backgroundColor: 'black',
                            left: 50 * (i + 1) -90,
                            top: horizontalLines[i]
                        }}/>
                    )}

                    <TouchableOpacity onPress={() => moveImage(i)}>
                        <Animated.View style={{transform: [{translateY: position}]}}>
                            <Image
                                source={{uri: imageUriArray[i % imageUriArray.length]}}
                                style={{width: 100, height: 100, margin: 5}}
                            />
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
};

export default Sadari;

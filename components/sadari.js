import React, {useEffect, useState} from 'react';
import {Animated, Dimensions, Image, TouchableOpacity, View} from 'react-native';

const windowWidth = Dimensions.get('window').width;

const Sadari = ({cnt}) => {
    const [positions, setPositions] = useState([]);
    const [horizontalLines, setHorizontalLines] = useState([]);

    const imageUriArray = ['https://i.namu.wiki/i/NB_qC6YRjH7hv6elNznBIBOBZ5AwE-PKYEWKcU03aFzGsc60bOt9KLxocyvB01OxAbOG8joW9mgkShFmTaTKsQ.webp'];

    useEffect(() => {
        const newPositions = Array(cnt).fill().map(() => new Animated.ValueXY({x: 0, y: 0}));
        setPositions(newPositions);

        const newHorizontalLines = Array(cnt).fill().map(() => ({
            top: Math.random() * 300 - 50, // 세로줄 길이 범위 내에서 랜덤 위치
            connectedColumn: Math.floor(Math.random() * (cnt - 1)) // 연결된 세로줄 인덱스
        }));
        setHorizontalLines(newHorizontalLines);
    }, [cnt]);

    const moveImage = index => {
        let sequence = [];
        let currentY = 90; // 시작점의 Y 위치
        let currentColumn = index; // 현재 세로줄 인덱스

        horizontalLines.forEach(line => {
            if (line.top > currentY && line.top < currentY + 500) {
                // 현재 위치에서 가로줄까지의 수직 이동 추가
                sequence.push(
                    Animated.timing(positions[index].y, {
                        toValue: line.top,
                        duration: (line.top - currentY) * 1, // 이동 속도 조정
                        useNativeDriver: false
                    })
                );

                // 수평 이동 추가
                const targetColumn = line.connectedColumn === currentColumn ? currentColumn + 1 : currentColumn - 1;
                if (targetColumn >= 0 && targetColumn < cnt) {
                    sequence.push(
                        Animated.timing(positions[index].x, {
                            toValue: targetColumn * columnWidth, // 목표 세로선의 X 위치
                            duration: 500, // 수평 이동 시간
                            useNativeDriver: false
                        })
                    );
                    currentColumn = targetColumn; // 현재 세로줄 인덱스 업데이트
                }
                currentY = line.top; // 현재 Y 위치 업데이트
            }
        });

        // 가장 마지막 수직 이동 추가
        sequence.push(
            Animated.timing(positions[index].y, {
                toValue: 500,
                duration: (500 - currentY) * 1,
                useNativeDriver: false
            })
        );

        Animated.sequence(sequence).start();
    };


    const columnWidth = windowWidth / (1.5 * cnt);

    const renderHorizontalLine = (index) => {
        const line = horizontalLines[index];
        if (line && index < cnt - 1) {
            return (<View style={{
                position: 'absolute',
                width: columnWidth,
                height: 10,
                backgroundColor: 'black',
                left: columnWidth / 2,
                top: line.top + 180
            }}/>);
        }
        return null;
    };

    return (<View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 100}}>
        {positions.map((position, i) => (
            <View key={`player-${i}`} style={{position: 'relative', width: columnWidth, alignItems: 'center'}}>
                {renderHorizontalLine(i)}
                <View style={{
                    position: 'absolute',
                    width: 10,
                    height: 500,
                    backgroundColor: 'black',
                    left: columnWidth / 2 - 5,
                    top: 90
                }}/>

                <TouchableOpacity onPress={() => moveImage(i)}>
                    <Animated.View style={{transform: [{translateX: position.x}, {translateY: position.y}]}}>
                        <Image
                            source={{uri: imageUriArray[i % imageUriArray.length]}}
                            style={{width: 50, height: 50, margin: 5}}
                        />
                    </Animated.View>
                </TouchableOpacity>
            </View>))}
    </View>);
};

export default Sadari;

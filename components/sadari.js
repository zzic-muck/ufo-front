import React, {useEffect, useState} from 'react';
import {Animated, Dimensions, Image, TouchableOpacity, View} from 'react-native';

const windowWidth = Dimensions.get('window').width;

const Sadari = ({cnt}) => {
    const [positions, setPositions] = useState([]);
    const [horizontalLines, setHorizontalLines] = useState([]);
    const [columnsWithHorizontalLines, setColumnsWithHorizontalLines] = useState([]);

    const imageUriArray = ['https://i.namu.wiki/i/NB_qC6YRjH7hv6elNznBIBOBZ5AwE-PKYEWKcU03aFzGsc60bOt9KLxocyvB01OxAbOG8joW9mgkShFmTaTKsQ.webp'];


    useEffect(() => {
        const newPositions = Array(cnt).fill().map(() => new Animated.ValueXY({x: 0, y: 0}));
        setPositions(newPositions);

        const newHorizontalLines = [];
        const columnsWithHorizontalLines = Array(cnt).fill().map(() => []);

        for (let i = 0; i < cnt - 1; i++) {
            // for (let j = 0; j < 3; j++) { // 각 세로선당 3개의 가로선
            const yPosition = Math.random() * 300 + 100;
            newHorizontalLines.push({
                fromColumn: i, toColumn: i + 1, yPosition: yPosition,
            });

            // 현재 세로선에 시작하는 가로선 정보 추가
            columnsWithHorizontalLines[i].push({
                toColumn: i + 1, yPosition: yPosition,
            });

            // 인접한 세로선에 연결되는 가로선 정보 추가
            columnsWithHorizontalLines[i + 1].push({
                fromColumn: i, yPosition: yPosition,
            });
            // }
        }

        setHorizontalLines(newHorizontalLines);
        // columnsWithHorizontalLines에 각 세로줄별 가로줄 정보가 저장됩니다.
        setColumnsWithHorizontalLines(columnsWithHorizontalLines);
        console.log(columnsWithHorizontalLines); // 디버깅을 위해 콘솔에 출력
    }, [cnt]);


    const moveImage = index => {
        console.log("Clicked image index:", index); // 클릭한 이미지의 인덱스를 콘솔에 표시
        // 여기서 columnsWithHorizontalLines 사용 가능
        console.log("Horizontal lines for column", index, ":", columnsWithHorizontalLines[index]);

        let sequence = [];
        let currentY = 90; // 시작점의 Y 위치
        let currentColumn = index; // 현재 세로줄 인덱스


        // 마지막 수직 이동 추가
        sequence.push(Animated.timing(positions[index].y, {
            toValue: 500, duration: (500 - currentY) * 1, useNativeDriver: false
        }));

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
                top: line.yPosition
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
                    height: 600,
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

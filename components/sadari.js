import React, {useEffect, useState} from 'react';
import {Animated, Dimensions, Image, TouchableOpacity, View, Text } from 'react-native';

const windowWidth = Dimensions.get('window').width;

const Sadari = ({cnt}) => {
    const [positions, setPositions] = useState([]);
    const [horizontalLines, setHorizontalLines] = useState([]);
    const [columnsWithHorizontalLines, setColumnsWithHorizontalLines] = useState([]);
    const [finalIndexes, setFinalIndexes] = useState(Array(cnt).fill(null)); // 각 세로줄의 최종 lineIndex를 저장하는 state
    const columnWidth = windowWidth / (1.5 * cnt);
    const imageUriArray = ['https://i.namu.wiki/i/NB_qC6YRjH7hv6elNznBIBOBZ5AwE-PKYEWKcU03aFzGsc60bOt9KLxocyvB01OxAbOG8joW9mgkShFmTaTKsQ.webp'];


    useEffect(() => {
        const newPositions = Array(cnt).fill().map(() => new Animated.ValueXY({x: 0, y: 0}));
        setPositions(newPositions);

        const newHorizontalLines = [];
        const columnsWithHorizontalLines = Array(cnt).fill().map(() => []);

        for (let i = 0; i < cnt - 1; i++) {

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

        }
        console.log(columnsWithHorizontalLines);
        setHorizontalLines(newHorizontalLines);
        // columnsWithHorizontalLines에 각 세로줄별 가로줄 정보가 저장됩니다.
        setColumnsWithHorizontalLines(columnsWithHorizontalLines);
        for (let j = 0; j < columnsWithHorizontalLines.length; j++) {
            columnsWithHorizontalLines[j].sort((a, b) => a.yPosition - b.yPosition);
        }
    }, [cnt]);


    const moveImage = index => {

        let sequence = [];
        let currentY = 90; // 시작점의 Y 위치
        let currentX = 0;
        let movto = 0;
        let lineIndex = index;

        for (let i = 0; i < 3; i++) {
            let nowpos = 0;
            console.log("반복횟수", i);
            for (let j = 0; j < columnsWithHorizontalLines[lineIndex].length; j++) {
                if (columnsWithHorizontalLines[lineIndex][j].yPosition > currentY) {
                    sequence.push(Animated.timing(positions[index].y, {
                        toValue: columnsWithHorizontalLines[lineIndex][j].yPosition - 10,
                        duration: (500 - currentY) * 1,
                        useNativeDriver: false
                    }));
                    currentY = columnsWithHorizontalLines[lineIndex][j].yPosition
                    console.log("움직였다....");
                    nowpos = j;
                    break;
                }
            }
            console.log("지금은 어디인가요 ", currentX);

            //옆으로 가자
            // 옆으로 이동
            let line = columnsWithHorizontalLines[lineIndex][nowpos];
            if (line.toColumn !== undefined && line.toColumn !== lineIndex) {


                currentX += columnWidth; // 오른쪽으로 이동
                lineIndex = line.toColumn;
            } else if (line.fromColumn !== undefined && line.fromColumn !== lineIndex) {


                currentX -= columnWidth; // 왼쪽으로 이동
                lineIndex = line.fromColumn;
            }

            sequence.push(Animated.timing(positions[index].x, {
                toValue: currentX, duration: 300, useNativeDriver: false
            }));


            console.log("어디로 갈까요", lineIndex);

            let lastidx = columnsWithHorizontalLines[lineIndex].length - 1;

            if (currentY === columnsWithHorizontalLines[lineIndex][lastidx].yPosition) {
                console.log("끝난듯??", i);
                sequence.push(Animated.timing(positions[index].y, {
                    toValue: 600, duration: (500 - currentY) * 1, useNativeDriver: false
                }));
                currentY = 600;
                break;
            }
        }
        console.log(" 얘 결과 값", lineIndex);
        setFinalIndexes(prevIndexes => {
            const newIndexes = [...prevIndexes];
            newIndexes[index] = lineIndex;
            return newIndexes;
        });

        Animated.sequence(sequence).start();
    };

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
                {finalIndexes[i] !== null && (
                    <Text style={{ position: 'absolute', bottom: 0, left: columnWidth / 2, color: 'black' }}>
                        {finalIndexes[i]}
                    </Text>
                )}
                <Text style={{ position: 'absolute', top: 700, left: columnWidth / 2 - 50, color: 'black' }}>
                    {"여기에 원하는 텍스트"}
                </Text>
            </View>))}
    </View>);
};

export default Sadari;

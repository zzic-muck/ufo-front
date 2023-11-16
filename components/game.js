import React, {useEffect, useState} from 'react';
import {Alert, Button, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const GRID_SIZE = 6;
const MOLE_APPEAR_DURATION = 800;
const BOMB_APPEAR_DURATION = 500; // 폭탄이 나타나는 시간
const SPECIAL_BLOCK_APPEAR_DURATION = 1000; // 3점짜리 블록이 나타나는 시간 간격
const GAME_DURATION = 20000; // 1분
const BOMB_PENALTY = 1; // 폭탄 버튼 점수 패널티
const SPECIAL_BLOCK_POINTS = 3;

// 화면 크기에 따라 그리드 크기 조정
const windowWidth = Dimensions.get('window').width;
const MAX_GRID_WIDTH = 700; // 최대 그리드 크기 (예: 400픽셀)
const gridWidth = Math.min(windowWidth * 0.8, MAX_GRID_WIDTH); // 화면 너비의 80% 혹은 최대 크기 중 작은 값
const cellSize = gridWidth / GRID_SIZE; // 각 격자 칸의 크기

const MoleGame = () => {
    const [activeMole, setActiveMole] = useState(null);
    const [activeBombs, setActiveBombs] = useState([]);
    const [activeSpecialBlock, setActiveSpecialBlock] = useState(null); // 3점짜리 블록
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [gameActive, setGameActive] = useState(true);

    const moleImageUri = 'https://i.namu.wiki/i/aJtwJmF0Ece9P0cM6dEahMsHi76985s26uZY4fAY-ROVpyGH2eGsAVR09PfNZeygyToACJJl97M-_wYr5bzNyVivyPcuirmUJuguUEJJfG0el3DGDSxlxWAoLkCSR9-P6ArWIeb1RwWl2Ni_D875CQ.webp'; // 두더지 이미지 경로
    const bombImageUri = 'https://cdn.011st.com/11dims/resize/600x600/quality/75/11src/product/5321793482/B.jpg?499000000'; // 폭탄 이미지 경로
    const specialBlockImageUri = 'https://static.wikia.nocookie.net/pokemon/images/1/13/%EB%8B%A5%ED%8A%B8%EB%A6%AC%EC%98%A4_%EA%B3%B5%EC%8B%9D_%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8.png/revision/latest?cb=20170405005841&path-prefix=ko'; // 3점짜리 블록 이미지 경로

    useEffect(() => {
        if (!gameActive) return;

        const moleInterval = setInterval(() => {
            const nextMole = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
            setActiveMole(nextMole);
        }, MOLE_APPEAR_DURATION);

        const bombInterval = setInterval(() => {
            const nextBombs = new Array(3).fill(null).map(() => Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE)));
            setActiveBombs(nextBombs);
        }, BOMB_APPEAR_DURATION);

        const specialBlockInterval = setInterval(() => {
            const nextSpecialBlock = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
            setActiveSpecialBlock(nextSpecialBlock);
        }, SPECIAL_BLOCK_APPEAR_DURATION);

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 0) {
                    clearInterval(moleInterval);
                    clearInterval(bombInterval);
                    clearInterval(specialBlockInterval);
                    clearInterval(timer);
                    setGameActive(false);
                    return 0;
                }
                return prevTime - 1000;
            });
        }, 1000);

        return () => {
            clearInterval(moleInterval);
            clearInterval(bombInterval);
            clearInterval(specialBlockInterval);
            clearInterval(timer);
        };
    }, [gameActive]);

    useEffect(() => {
        if (!gameActive) {
            Alert.alert("게임 종료!", `당신의 점수는 ${score}점입니다.`);
        }
    }, [gameActive, score]);

    const handlePress = (index) => {
        if (index === activeMole && gameActive) {
            setScore(score + 1);
            setActiveMole(null);
        } else if (activeBombs.includes(index) && gameActive) {
            setScore(Math.max(score - BOMB_PENALTY, 0));
            setActiveBombs(prev => prev.filter(bombIndex => bombIndex !== index));
        } else if (index === activeSpecialBlock && gameActive) {
            setScore(score + SPECIAL_BLOCK_POINTS);
            setActiveSpecialBlock(null);
        }
    };

    const restartGame = () => {
        setScore(0);
        setTimeLeft(GAME_DURATION);
        setGameActive(true);
    };

    return (<View style={styles.container}>
        <Text style={styles.timerText}>남은 시간: {Math.round(timeLeft / 1000)}초</Text>
        <Text style={styles.scoreText}>점수: {score}</Text>
        {/*<View style={styles.grid}>*/}
        <View style={[styles.grid, { width: gridWidth, height: gridWidth }]}>
            {[...Array(GRID_SIZE * GRID_SIZE)].map((_, index) => (<TouchableOpacity
                key={index}
                // style={styles.moleHole}
                style={[styles.moleHole, { width: cellSize, height: cellSize }]}
                onPress={() => handlePress(index)}
            >
                {activeMole === index && gameActive && (<Image
                    source={{uri: moleImageUri}}
                    style={styles.moleImage}
                />)}
                {activeBombs.includes(index) && gameActive && (<Image
                    source={{uri: bombImageUri}}
                    style={styles.moleImage}
                />)}
                {activeSpecialBlock === index && gameActive && (
                    <Image source={{uri: specialBlockImageUri}} style={styles.moleImage}/>)}
            </TouchableOpacity>))}
        </View>
        {!gameActive && (<Button title="게임 재시작" onPress={restartGame}/>)}
    </View>);
};

const styles = StyleSheet.create({
    container: {
        flex: 1, alignItems: 'center', justifyContent: 'center'
    }, scoreText: {
        fontSize: 24, marginBottom: 20
    }, grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        // width: 600, // 격자 크기 조정
        // height: 600
    }, moleHole: {
        // width: '16.66%', // 6x6 격자의 각 구멍 크기
        // height: '16.66%',
        borderWidth: 1,
        borderColor: 'black'
    }, moleImage: {
        width: '100%', height: '100%'
    }, activeMole: {
        backgroundColor: 'brown' // 두더지 색상
    }, timerText: {
        fontSize: 20, marginBottom: 10
    }
});

export default MoleGame;

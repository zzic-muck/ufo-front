import React, { useEffect, useState } from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image, Alert} from 'react-native';

const GRID_SIZE = 4; // 격자 크기
const MOLE_APPEAR_DURATION = 1000; // 두더지가 나타나는 시간 (밀리초)
const GAME_DURATION = 60000; // 1분 (60,000밀리초)

const MoleGame = () => {
    const [activeMole, setActiveMole] = useState(null); // 활성화된 두더지 위치
    const [score, setScore] = useState(0); // 점수
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [gameActive, setGameActive] = useState(true);

    const moleImageUri = 'https://i.namu.wiki/i/aJtwJmF0Ece9P0cM6dEahMsHi76985s26uZY4fAY-ROVpyGH2eGsAVR09PfNZeygyToACJJl97M-_wYr5bzNyVivyPcuirmUJuguUEJJfG0el3DGDSxlxWAoLkCSR9-P6ArWIeb1RwWl2Ni_D875CQ.webp'; //

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         const nextMole = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
    //         setActiveMole(nextMole);
    //     }, MOLE_APPEAR_DURATION);
    //
    //     return () => clearInterval(interval);
    // }, []);

    useEffect(() => {
        if (!gameActive) return;

        // 두더지 나타내기
        const moleInterval = setInterval(() => {
            const nextMole = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
            setActiveMole(nextMole);
        }, MOLE_APPEAR_DURATION);

        // 타이머
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 0) {
                    clearInterval(moleInterval);
                    clearInterval(timer);
                    setGameActive(false);
                    Alert.alert("게임 종료!", `당신의 점수는 ${score}점입니다.`);
                    return 0;
                }
                return prevTime - 1000;
            });
        }, 1000);

        return () => {
            clearInterval(moleInterval);
            clearInterval(timer);
        };
    }, [gameActive]);

    const handlePress = (index) => {
        if (index === activeMole) {
            setScore(score + 1);
            setActiveMole(null); // 두더지 초기화
        }
    };

    return (
        <View style={styles.container}>
            {/*<Text style={styles.scoreText}>점수: {score}</Text>*/}
            <Text style={styles.timerText}>남은 시간: {Math.round(timeLeft / 1000)}초</Text>
            <Text style={styles.scoreText}>점수: {score}</Text>

            <View style={styles.grid}>
                {[...Array(GRID_SIZE * GRID_SIZE)].map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.moleHole}
                        onPress={() => handlePress(index)}
                    >
                        {activeMole === index && (
                            <Image
                                source={{ uri: moleImageUri }}
                                style={styles.moleImage}
                            />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    scoreText: {
        fontSize: 24,
        marginBottom: 20
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 300,
        height: 300
    },
    moleHole: {
        width: '25%',
        height: '25%',
        borderWidth: 1,
        borderColor: 'black'
    },
    activeMole: {
        backgroundColor: 'brown' // 두더지 색상
    },
    moleImage: {
        width: '100%',
        height: '100%'
    },
    timerText: {
        fontSize: 20,
        marginBottom: 10
    }
});

export default MoleGame;

import * as React from 'react';
import {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './views/HomeScreen';
import LadderScreen from "./views/LadderScreen";
import {Button, StatusBar, View, StyleSheet} from "react-native";
import RouletteScreen from "./views/RouletteScreen";
import NewGame from "./views/NewGame";
import ChatRoom from "./views/chatScreen";


const Stack = createNativeStackNavigator();

function App() {


    return (
        <View style={styles.container}>
            <NavigationContainer>
                <StatusBar hidden={true}/>
                <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
                    <Stack.Screen name="Home" component={HomeScreen}/>
                    <Stack.Screen name="Ladder" component={LadderScreen}/>
                    <Stack.Screen name="Roulette" component={RouletteScreen}/>
                    <Stack.Screen name="NewGame" component={NewGame}/>
                    <Stack.Screen name="Chat" component={ChatRoom}/>
                </Stack.Navigator>
            </NavigationContainer>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#fff',
    },
});

export default App;

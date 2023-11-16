import * as React from 'react';
import {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './views/HomeScreen';
import DetailsScreen from './views/DetailsScreen';
import LadderScreen from "./views/LadderScreen";
import {Button, StatusBar, View, StyleSheet} from "react-native";
import RouletteScreen from "./views/RouletteScreen";
import NewGame from "./views/NewGame";

const Stack = createNativeStackNavigator();

function App() {

    const [topContent, setTopContent] = useState('content1');

    return (
        <View style={styles.container}>
            <NavigationContainer>
                <StatusBar hidden={true}/>
                <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
                    <Stack.Screen name="Home" component={HomeScreen}/>
                    <Stack.Screen name="Details" component={DetailsScreen}/>
                    <Stack.Screen name="Ladder" component={LadderScreen}/>
                    <Stack.Screen name="Roulette" component={RouletteScreen}/>
                    <Stack.Screen name="NewGame" component={NewGame}/>
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

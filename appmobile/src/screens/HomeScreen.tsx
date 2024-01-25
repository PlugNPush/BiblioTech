import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';
import NavBar from '@src/components/NavBar';

const HomeScreen: React.FC = () => {
    return (
        <ThemeContext.Consumer>
        {({ theme }) => (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme === 'light' ? 'white' : 'black' }}>
            <NavBar />
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: theme === 'light' ? 'black' : 'white' }}
            >Home Screen</Text>
            </View>
        </SafeAreaView>
        )}
        </ThemeContext.Consumer>
    );
}

export default HomeScreen;
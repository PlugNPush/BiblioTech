import React from 'react';
import { SafeAreaView, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native';

import { ThemeContext } from '@src/contexts/ThemeContext';
import LoginForm from '@src/components/connection/LoginForm';
import RegisterForm from '@src/components/connection/RegisterForm';

const StartScreen: React.FC = () => {
    const [showLogin, setShowLogin] = React.useState(true);

    const toggleForm = () => {
        setShowLogin(!showLogin);
    };

    return (
        <ThemeContext.Consumer>
        {({ theme, toggleTheme }) => (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme === 'light' ? 'white' : 'black' }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {showLogin ? <LoginForm toggleForm={toggleForm} /> : <RegisterForm toggleForm={toggleForm} />}
            </View>
        </SafeAreaView>
        )}
        </ThemeContext.Consumer>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    input: {
      width: '80%',
      height: 50,
      padding: 10,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      marginBottom: 10,
    },
    button: {
      width: '80%',
      height: 50,
      backgroundColor: '#007bff',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
      marginBottom: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
    },
    signupText: {
      fontSize: 16,
    },
    signupLink: {
      color: '#007bff',
      fontWeight: 'bold',
    },
});

export default StartScreen;
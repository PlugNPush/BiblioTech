/*
import React, { useState } from 'react';

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Handle form submission logic
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={handleUsernameChange} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={handlePasswordChange} />
      </label>
      <br />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
*/
// RegisterForm.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';

interface FormProps {
    toggleForm: () => void;
}

const RegisterForm: React.FC<FormProps> = ({toggleForm}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = () => {
        // Ajoutez votre logique d'inscription ici
        console.log('Register:', username, password, confirmPassword);
    };

    return (
        <View>
            <Text>Register Form</Text>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={text => setUsername(text)}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry
            />
            <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={text => setConfirmPassword(text)}
                secureTextEntry
            />
            <Button title="Register" onPress={handleRegister} />
            <TouchableOpacity>
                <Text style={styles.registerText}>
                You already have an account?, <Text style={styles.registerLink} onPress={toggleForm}>Login</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

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
    registerText: {
      fontSize: 16,
    },
    registerLink: {
      color: '#007bff',
      fontWeight: 'bold',
    },
});

export default RegisterForm;


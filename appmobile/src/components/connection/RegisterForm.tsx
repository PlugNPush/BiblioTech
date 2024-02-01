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
import axios from 'axios';

const API_HOST = process.env.API_HOST || '192.168.56.1';
const API_PORT = process.env.API_PORT || 8081; // 8100 is the server port, 8081 is the metro bundler port

interface FormProps {
    toggleForm: () => void;
}

const RegisterForm: React.FC<FormProps> = ({toggleForm}) => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [wrongPassword, setWrongPassword] = useState(false);

    const handleRegister = () => {
        // Ajoutez votre logique d'inscription ici
        console.log('Register:', firstname, lastname, email, password, wrongPassword);
        if (wrongPassword) {
            console.log("Passwords don't match");
            return;
        }
        console.log(`http://${API_HOST}:${API_PORT}/api/signin`);
        axios.post(`http://${API_HOST}:${API_PORT}/api/signin`, {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password
        })
        .then(function (response) {
            console.log(response);
            if (response.data.success) {
                console.log('Register success');
                // send to home page
                
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    };

    const handleConfirmPassword = (text: string) => {
        if (password != text) {
            setWrongPassword(true);
        }
        setWrongPassword(false);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Biblio'Tech</Text>
            <TextInput
                style={styles.input}
                placeholder="Firstname"
                value={firstname}
                onChangeText={text => setFirstname(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Lastname"
                value={lastname}
                onChangeText={text => setLastname(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={text => setEmail(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                onChangeText={text => handleConfirmPassword(text)}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
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


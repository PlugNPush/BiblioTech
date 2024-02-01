/*import React, { useState } from 'react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your login logic here
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input type="email" value={email} onChange={handleEmailChange} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={handlePasswordChange} />
      </label>
      <br />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;*/
// LoginForm.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const API_HOST = process.env.API_HOST || '192.168.56.1';
const API_PORT = process.env.API_PORT || 8081; // 8100 is the server port, 8081 is the metro bundler port

interface FormProps {
    toggleForm: () => void;
}

const LoginForm: React.FC<FormProps>= ({toggleForm}) => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [wrongPassword, setWrongPassword] = useState(false);

    const handleLogin = () => {
        // Ajoutez votre logique de connexion ici
        console.log('Login:', email, password);
        console.log(`http://${API_HOST}:${API_PORT}/api/login`);
        axios.post(`http://${API_HOST}:${API_PORT}/api/login`, {
            email: email,
            password: password
        })
        .then(function (response) {
            console.log(response);
            if(response.status == 200){
                console.log("Login success");
                // send to home page
                navigation.navigate('Home');
            } else {
              setWrongPassword(true);
              setTimeout(() => {
                setWrongPassword(false);
              }, 3000);
            }
        })
        .catch(function (error) {
          setWrongPassword(true);
          setTimeout(() => {
              setWrongPassword(false);
          }, 3000);
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Biblio'Tech</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            {wrongPassword && <Text style={styles.errorText}>Wrong email or password</Text>}
            <TouchableOpacity>
                <Text style={styles.signupText}>
                You don't have an account?, <Text style={styles.signupLink} onPress={toggleForm}>SignUp</Text>
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
    signupText: {
      fontSize: 16,
    },
    signupLink: {
      color: '#007bff',
      fontWeight: 'bold',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
});

export default LoginForm;

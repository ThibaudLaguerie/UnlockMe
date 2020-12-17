import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, FlatList, Text, Alert } from 'react-native';
// Text-Input
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, ButtonGroup } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';
import auth from '@react-native-firebase/auth';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamsList } from '../types/types';

export type Props = StackScreenProps<RootStackParamsList, 'Auth'>

const AuthScreen: React.FC<Props> = ({ navigation, route }) => {
    // const auth = useAuth()
    const [index, setIndex] = useState(0);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const auth = useAuth()
    const buttons = ["Register", "Log in"];
    // Remise à zéro des champs username et password
    const raz = () => {
        setUsername('')
        setPassword('')
    }

    const login = async () => {
        // Action si le username est vide
        if (!username.trim()) {
            Alert.alert('Please Enter a Username');
            return;
        }
        // Action si le password est vide
        if (!password.trim()) {
            Alert.alert('Please Enter a Password');
            return;
        }

        if (index == 0) {
            try {
                await auth.register(username, password)
                Alert.alert("Account was created")
                navigation.navigate('PasswordList', { username: username })
                raz()
            } catch (e) {
                Alert.alert(e)
            }
        } else {
            try {
                await auth.signIn(username, password)
                navigation.navigate('PasswordList', { username: username })
                raz()
            } catch (e) {
                // e.code = "auth/user-not-found"
                // e.message = "There is no user record corresponding to this identifier. The user may have been deleted."
                if (e.code === "auth/user-not-found") {
                    Alert.alert('Ce compte n\'existe pas')
                }
                else {
                    Alert.alert(e.message)
                }
            }
        }

    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Text style={styles.title}>
                Unlock Me
            </Text>
            <ButtonGroup
                onPress={setIndex}
                selectedIndex={index}
                buttons={buttons}
                containerStyle={styles.toggleButtons}
                selectedButtonStyle={{ backgroundColor: "#202326" }}
            />
            <View style={styles.inputContainer}>
                <Input
                    value={username}
                    key="Username"
                    placeholder="Username"
                    textContentType="emailAddress"
                    keyboardType="email-address"
                    leftIcon={{ type: 'font-awesome', name: 'user', color: "#fff", style: { margin: 10 } }}
                    style={styles.input}
                    placeholderTextColor="#fff"
                    onChangeText={value => setUsername(value)}
                />
                <Input
                    value={password}
                    key="Password"
                    placeholder="Password"
                    leftIcon={{ type: 'font-awesome', name: 'lock', color: "#fff", style: { margin: 10 } }}
                    style={styles.input}
                    placeholderTextColor="#fff"
                    secureTextEntry={true}
                    onChangeText={value => setPassword(value)}
                />
            </View>
            <View>
                <Button
                    title={buttons[index]}
                    buttonStyle={styles.button}
                    onPress={() => login()}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#96928f',
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleButtons: {
        marginBottom: 50
    },
    inputContainer: {
        width: "100%"
    },
    title: {
        fontWeight: 'bold',
        fontSize: 40,
        color: "#fff",
        marginBottom: 50
    },
    input: {
        width: "90%",
        color: "#fff",
        borderBottomColor: "#96928f",
        borderBottomWidth: 1
    },
    button: {
        backgroundColor: "#202326"
    }
});

export default AuthScreen
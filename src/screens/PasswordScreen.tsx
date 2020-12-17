import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Divider, Icon, Overlay } from 'react-native-elements';
import { RootStackParamsList, Datapass } from '../types/types';
import firestore from '@react-native-firebase/firestore';
import { toDatapass } from '../utils/utils';
import { useAuth } from '../contexts/AuthContext';
import { WINDOW_WIDTH } from '../constants/constants';

type Props = StackScreenProps<RootStackParamsList, 'PasswordList'>

const PasswordScreen: React.FC<Props> = ({ navigation, route }) => {

    // modal state
    const [visible, setVisibility] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [mode, setMode] = useState<string>('add')

    const [datapasses, setDatapasses] = useState<Datapass[]>([]);
    const auth = useAuth()
    const usersCollection = firestore().collection('users')

    useEffect(() => {
        getLogs()
    }, [])

    const getLogs = async () => {
        const logs = (await usersCollection.doc(auth.user?.uid).collection('datapass').get()).docs
        setDatapasses(logs.map((datapass) => toDatapass(datapass.data())))
    }

    const addLogs = async () => {
        await usersCollection.doc(auth.user?.uid).collection('datapass').doc(title).set({ title: title, username: username, password: password }).then(() => {
            getLogs()
            setVisibility(false)
            reset()
        })
    }

    const removeLogs = async (itemTitle: string) => {
        await usersCollection.doc(auth.user?.uid).collection('datapass').doc(itemTitle).delete().then(() => getLogs())
    }

    const initiateUpdateLogs = async (item: Datapass) => {
        setMode('update')
        setTitle(item.title)
        setUsername(item.username)
        setPassword(item.password)
        setVisibility(true)
    }
    const updateLogs = async () => {
        await usersCollection.doc(auth.user?.uid).collection('datapass').doc(title).update({ username: username, password: password }).then(() => {
            getLogs()
            setVisibility(false)
            reset()
            setTitle('')
        })
    }

    const renderHeader = () => {
        return (
            <View style={styles.header}>
                <Text style={styles.headerLabels}>
                    Site web
                </Text>
                <Text style={styles.headerLabels}>
                    Identifiant
                </Text>
                <Text style={styles.headerLabels}>
                    Mot de passe
                </Text>

                <Icon type="feather" name="edit" color="transparent" />
                <Icon type="ionicon" name="trash-outline" color="transparent" />
            </View>
        )
    }

    const renderItem = (item: Datapass) => {
        return (
            <View style={styles.header}>
                <View style={styles.itemViews}>
                    <Text style={styles.itemLabels}>{item.title}</Text>
                </View>
                <Divider style={{ width: 1, height: "100%", backgroundColor: '#444' }} />
                <View style={styles.itemViews}>
                    <Text style={styles.itemLabels}>{item.username}</Text>
                </View>
                <Divider style={{ width: 1, height: "100%", backgroundColor: '#444' }} />
                <View style={styles.itemViews}>
                    <Text style={styles.itemLabels}>{item.password}</Text>
                </View>

                <TouchableOpacity onPress={() => initiateUpdateLogs(item)}>
                    <Icon type="feather" name="edit" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeLogs(item.title)}>
                    <Icon type="ionicon" name="trash-outline" />
                </TouchableOpacity>
            </View>
        )
    }

    const reset = () => {
        if (mode == 'add') {
            setTitle('')
        }
        setUsername('')
        setPassword('')
    }

    const validateForm = () => {
        if (title == '' || username == '' || password == '') {
            Alert.alert('Erreur', 'Remplissez l\'ensemble des entrées de texte')
        } else if (mode == 'add') {
            addLogs()
        } else {
            updateLogs()
        }
    }

    const modalContent = () => {
        return (
            <View>
                <View style={{ alignItems: 'flex-end' }}>
                    <TouchableOpacity onPress={() => setVisibility(false)}>
                        <Icon name="close" type="ionicon" color="#ddd" size={WINDOW_WIDTH * 0.07} />
                    </TouchableOpacity>
                </View>
                <View>
                    <TextInput style={styles.inputs} placeholderTextColor="#555" editable={mode == 'update' ? false : true}
                        placeholder="Site / Application" value={title}
                        onChangeText={title => setTitle(title)}
                    />
                    <TextInput style={styles.inputs} placeholderTextColor="#555"
                        placeholder="Identifiant" value={username}
                        onChangeText={username => setUsername(username)}
                    />
                    <TextInput style={styles.inputs} placeholderTextColor="#555"
                        placeholder="Mot de passe" value={password}
                        onChangeText={password => setPassword(password)}
                    />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={styles.buttonsOverlay} onPress={() => validateForm()}>
                        <Icon name="checkmark-circle" type="ionicon" color="#ddd" size={WINDOW_WIDTH * 0.1} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonsOverlay} onPress={() => reset()}>
                        <Icon name="close-circle" type="ionicon" color="#ddd" size={WINDOW_WIDTH * 0.1} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>

            <Overlay isVisible={visible} overlayStyle={styles.overlayStyle}>
                {modalContent()}
            </Overlay>
            <FlatList
                data={datapasses}
                keyExtractor={(item) => item.title + item.username + item.password}
                renderItem={({ item }) => renderItem(item)}
                ListHeaderComponent={renderHeader}
            />
            <View>
                <TouchableOpacity onPress={() => {
                    setMode('add')
                    setVisibility(true)
                }}>
                    <Icon name="add-circle" type="ionicon" color="#000" size={WINDOW_WIDTH * 0.15} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#96928f',
        justifyContent: 'center',
    },
    header: {
        flex: 1,
        borderBottomColor: "#555",
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLabels: {
        flex: 1,
        padding: WINDOW_WIDTH * 0.02,
        fontSize: WINDOW_WIDTH * 0.05,
        textAlign: 'center'
    },
    itemViews: {
        flex: 1,
        paddingVertical: WINDOW_WIDTH * 0.02,
    },
    itemLabels: {
        textAlign: 'center',
        fontSize: WINDOW_WIDTH * 0.04
    },
    overlayStyle: {
        width: WINDOW_WIDTH * 0.9,
        backgroundColor: '#222'
    },
    inputs: {
        padding: WINDOW_WIDTH * 0.02,
        marginVertical: WINDOW_WIDTH * 0.01,
        fontSize: WINDOW_WIDTH * 0.05,
        backgroundColor: '#aaa',
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        color: '#000'
    },
    buttonsOverlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default PasswordScreen
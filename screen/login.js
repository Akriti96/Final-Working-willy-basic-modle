import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    KeyboardAvoidingView,
    Alert,
    TouchableOpacity,
} from 'react-native';
import  firebase from 'firebase';
import db from '../config';

export default class Welcomescreen extends React.Component {
    constructor() {
        super();
        this.state = { emailid: '', password: '' };
    }


    login = async (email, password) => {
        if (email && password) {
            try {
                const response = await firebase
                    .auth()
                    .signInWithEmailAndPassword(email, password);
                if (response) {
                    this.props.navigation.navigate('TransastionScreen');
                }
            } catch (error) {
                switch (error.code) {
                    case 'auth/user-not-found':
                        Alert.alert('user does not exist');
                        console.log('user does not exist');
                        break;
                    case 'auth/invalid-email':
                        Alert.alert('incorrect email or password');
                        console.log('incorrect email or password');
                }
            }
        } else {
            Alert.alert(' enter correct email && password');
        }
    };
    render() {
        return (
            <View>
                <KeyboardAvoidingView style={{ alignItems: 'center', marginTop: 20 }}>
                    <Image
                        source={require('../assets/booklogo.jpg')}
                        style={{ width: 200, height: 200 }}
                    />
                    <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Willy App</Text>
                    <View>
                        <TextInput
                            style={styles.loginbox}
                            placeholder={'Enter email Id'}
                            keyboardType={'email-address'}
                            onChangeText={(text) => {
                                this.setState({
                                    emailid: text,
                                });
                            }}
                        />
                        <TextInput
                            style={styles.loginbox}
                            placeholder={'Enter password'}
                            secureTextEntry={true}
                            onChangeText={(text) => {
                                this.setState({
                                    password: text,
                                });
                            }}
                        />
                    </View>
                    <View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                this.login(this.state.emailid, this.state.password);
                            }}>
                            <Text>Login</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    loginbox: {
        width: 300,
        // height: 40,
        borderWidth: 2,
        paddingLeft: 10,
        fontSize: 20,
        marginTop: 20,
    },
    button: {
        width: 100,
        // heigth: 30,
        borderWidth: 1,
        marginTop: 20,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightblue',
    },
});

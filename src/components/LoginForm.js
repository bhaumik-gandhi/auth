import React, { Component } from 'react';
import { Text, AsyncStorage } from 'react-native'

import { Card, CardSection, Button, Input, Spinner  } from './common';

class LoginForm extends Component {

    constructor() {
        super(); 
        this.state = {
            email: '', 
            password: '',
            error: '',
            loading: false,
        };
        this.users = [
            {
                email: 'test@test.com',
                password: '123'
            }
        ]
    }

    checkUserNameAndPassword = (email, password) => {
        console.log("Users", this.users);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let user = this.users.find(user => user.email === email);
                console.log("user", user);
                if (user && user.email) {
                    if (password === user.password) {
                        resolve(true);
                    } else {
                        reject('Authentication failed');
                    }
                } else {
                    resolve(false);
                }
            }, 2000)
        })
    }

    createUserAndPassword = (email, password) => {
        return new Promise((resolve, reject) => {
            this.users.push({ email, password });
            console.log("Updated Users", this.users);
            setTimeout(() => {
                resolve(true);
            }, 2000)
        });
    }

    onLoginSucess() {
        console.log('SUCCESS', this.props);
        this.setState({
            email: '',
            password: '',
            loading: false,
            error: ''
        });
        AsyncStorage.setItem('isUserLoggedIn', 'YES');
        this.props.updateLoggedInState(true);
    }

    onLoginFail() {
        this.setState({ 
            error: 'Authentication failed',
            loading: false
        })
    }

    onButtonPress() {
        let { email, password } = this.state;

        this.setState({ 
            error: '', 
            loading: true 
        })

        this.checkUserNameAndPassword(email, password)
            .then(res => {
                if (res) {
                    return new Promise(resolve => resolve(true))
                } else {
                    return this.createUserAndPassword(email, password);
                }
            })
            .then(this.onLoginSucess.bind(this))
            .catch(err => {
                console.error('ABC', err);
                this.onLoginFail.bind(this)
            });
    }

    renderButton() {
        if (this.state.loading) {
            return <Spinner size='small' />
        }

        return (
            <Button onPress={this.onButtonPress.bind(this)}>
                Log in
            </Button>
        );
    }

    render() {
        return (
            <Card>
                <CardSection>
                    <Input
                        placeholder='user@gmail.com'
                        label='Email' 
                        value={this.state.email}
                        style={{ width: 100, height: 20 }}
                        onChangeText={email => this.setState({ email })}
                    />
                </CardSection>  

                <CardSection>
                    <Input 
                        placeholder='password'
                        label='Password'
                        value={this.state.password}
                        onChangeText={password => this.setState({ password })}
                        secureTextEntry
                    />
                </CardSection>

                <Text style={styles.errorStyle}>
                    {this.state.error}
                </Text>

                <CardSection>
                    {this.renderButton()}
                </CardSection>
            </Card>
        );
    }
}

const styles = {
    errorStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    }
}

export default LoginForm;
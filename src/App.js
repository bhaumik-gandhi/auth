import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';
import { Header, Button, Spinner, Card, CardSection } from './components/common';
import LoginForm from './components/LoginForm';

class App extends Component {

    state = {
        loggedIn: null
    };

    componentWillMount() {
        setTimeout( () => this.checkUserIsLoggedIn() , 2000)        
    }

    updateLoggedInState = (loggedIn) => {
        console.log('updateLoggedInState');
        this.setState({ loggedIn  })
    }

    checkUserIsLoggedIn() {
        AsyncStorage.getItem('isUserLoggedIn')
            .then(res => {
                console.log('getItem', res);
                if (res && res === 'YES') {
                    this.setState({ loggedIn: true })
                } else {
                    this.setState({ loggedIn: false })
                }
            })
            .catch(err => {
                console.error('err', err);
                this.setState({ loggedIn: false })
            })
    }

    logOutTheUser = () => {
        this.setState({ 
            loggedIn: false
        })
        AsyncStorage.removeItem('isUserLoggedIn');
    }

    renderContent() {
        switch (this.state.loggedIn) {
            case true:
                return <Card>
                    <CardSection> 
                        <Button onPress={() => this.logOutTheUser()} >Log out</Button>
                    </ CardSection> 
                </ Card>
            case false:
                return <LoginForm updateLoggedInState={this.updateLoggedInState} />
            default:
                return <Card>
                    <CardSection>   
                        <Spinner />
                    </CardSection>
                </Card>
        }
    }
    
    render() {
        return (
            <View>
                <Header headerText="Authentication" />
                {this.renderContent()}
            </View>
        );
    }
}

export default App;
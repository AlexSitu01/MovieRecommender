import { View, Text, AppState, StyleSheet } from 'react-native'
import React from 'react'
import { supabase } from '@/services/supabase'
import { Button, Input } from '@rneui/themed'


AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

const Auth = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) {
            alert(error.message);
        }
        setLoading(false);
    }

    async function signUpWithEmail() {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        })
        if (error) {
            alert(error.message);
        }
        if (!session) {
            alert('Check your email for the confirmation link');
        }
        setLoading(false);
    }

    return (
        <View className='flex-1 bg-[#020212]'>
            <View style={styles.container}>
                <View style={[styles.verticallySpaced, styles.mt20]}>
                    <Input
                        label="Email"
                        leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                        onChangeText={(text: string) => setEmail(text)}
                        value={email}
                        placeholder="email@address.com"
                        autoCapitalize={'none'}
                    />
                </View>
                <View style={styles.verticallySpaced}>
                    <Input
                        label="Password"
                        leftIcon={{ type: 'font-awesome', name: 'lock' }}
                        onChangeText={(text: string) => setPassword(text)}
                        value={password}
                        secureTextEntry={true}
                        placeholder="Password"
                        autoCapitalize={'none'}
                    />
                </View>
                <View style={[styles.verticallySpaced, styles.mt20]}>
                    <Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
                </View>
                <View style={styles.verticallySpaced}>
                    <Button title="Sign up" disabled={loading} onPress={() => signUpWithEmail()} />
                </View>
            </View>
        </View>


    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        padding: 12,
    },
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'stretch',
    },
    mt20: {
        marginTop: 20,
    }
});

export default Auth
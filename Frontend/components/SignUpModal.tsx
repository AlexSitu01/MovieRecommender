import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native'
import React, { SetStateAction, useState } from 'react'
import { updateUsername } from '@/services/supabase';
import { router } from 'expo-router';

interface SignUpModalProps {
    visible: boolean;
    setVisible: React.Dispatch<SetStateAction<boolean>>;
}

const SignUpModal = ({visible, setVisible}: SignUpModalProps) => {
    const [username, setUsername] = useState<string>('');
    const [modalError, setModalError] = useState<string | null>(null);
    
    const handleUserNameSubmit = async () => {
        if (!username || username.length < 3) {
            setModalError("Username must be at least 3 characters long");
            return;
        }
        try {
            updateUsername(username);
            setVisible(false);
        }
        catch (error) {
            console.log("Username update error:", error);
            setModalError("There was an error setting your username. Please try again.");
        }


    }
    return (
        <Modal onDismiss={handleUserNameSubmit} transparent={false} visible={visible} animationType='slide' onRequestClose={() => setVisible(false)}>
            <View className='size-full flex justify-center items-center bg-[#020212] gap-y-6'>
                <TextInput className='border-2 border-white rounded-lg w-2/3 p-4 text-lg text-white' onChangeText={setUsername} placeholder='Enter Username' placeholderTextColor='#888888'></TextInput>
                <TouchableOpacity className='bg-blue-400 rounded-lg p-2' onPress={() => setVisible(!visible)}>
                    <Text className='text-lg'>Set username</Text>
                </TouchableOpacity>
                <Text className='text-red-600'>{modalError}</Text>
            </View>
        </Modal>
    )
}

export default SignUpModal
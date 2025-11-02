import { View, Text, Modal, TextInput, Pressable } from 'react-native'
import React from 'react'

interface EditProfileModalProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Label = (placeholder: string, label: string, setValue: React.Dispatch<React.SetStateAction<boolean>>) => {
    return (
        <View className='z-10'>
            <Text className='text-white'></Text>
            <TextInput className='text-white' placeholder='Username' />
        </View>
    )
}

const handleSubmit = async () => {

}

const EditProfileModal = ({ visible, setVisible }: EditProfileModalProps) => {
    return (
        <Modal visible={visible} animationType='slide' transparent={true} onRequestClose={() => setVisible(false)}>
            <Pressable
                className='size-full flex justify-center items-center z-0'
                onPress={() => setVisible(!visible)}
            >
                <Pressable className='w-full' onPress={(e) => e.stopPropagation()}>
                    <View className='bg-gray-900 gap-y-6 w-full h-2/3 rounded-lg z-10'>
                        
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    )
}

export default EditProfileModal
import { View, Text, Modal, TextInput, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Label } from '@react-navigation/elements';

interface EditProfileModalProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    bio: string;
    userName: string;
}

interface LabelInputProps {
    placeholder: string;
    label: string;
    value?: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    className?: string;
    multiline?: boolean;
}

const LabelInput = ({ placeholder, label, value, setValue, className, multiline = false }: LabelInputProps) => {
    return (
        <View className={`w-full`}>
            <Text className='text-white text-lg'>{label}</Text>
            <TextInput value={value} className={` text-white border-2 border-white rounded-md ${className}`} placeholder={placeholder} onChangeText={setValue} placeholderTextColor='#888888' multiline={multiline} textAlignVertical='center' />
        </View>
    )
}


const EditProfileModal = ({ visible, setVisible, userName: prevUsername, bio: prevBio }: EditProfileModalProps) => {

    const [userName, setUserName] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const [loadingSave, setLoadingSave] = useState<boolean>(false);

    const handleSave = async () => {
        
    }


    useEffect(() => {
        if (visible) {
            setUserName(prevUsername);
            setBio(prevBio);
        }
    }, [visible, prevUsername, prevBio]);

    return (
        <Modal visible={visible} animationType='slide' transparent={true} onRequestClose={() => setVisible(false)}>
            <Pressable
                className='size-full flex justify-center items-center z-0'
                onPress={() => setVisible(!visible)}
            >
                <Pressable className='w-10/12 self-center' onPress={(e) => e.stopPropagation()}>
                    <View className='self-center bg-gray-900 gap-y-6 w-full h-[40rem] rounded-lg z-10 p-8 justify-center items-center pb-32'>
                        <LabelInput className='w-2/3 p-4' placeholder='Username' label='Username' setValue={setUserName} value={userName} />
                        <LabelInput className='w-full h-32 p-4' placeholder='Rating System' label='Rating System' value={bio} setValue={setBio} multiline={true} />

                        <Pressable className='bg-purple-700 rounded-full px-8 py-4 absolute bottom-10' onPress={handleSave}>
                            <Text className='text-white text-lg font-bold'>Save</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    )
}

export default EditProfileModal
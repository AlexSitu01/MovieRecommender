import { View, Text, Modal, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Label } from '@react-navigation/elements';
import { updateProfile } from '@/services/supabase';

interface EditProfileModalProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    bio: string;
    userName: string;
    avatar_url?: string;
    reloadProfile: () => Promise<void>;
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


const handleSave = async (userName: string, bio: string, setLoadingSave: React.Dispatch<React.SetStateAction<boolean>>, setVisible: React.Dispatch<React.SetStateAction<boolean>>, reloadProfile: () => Promise<void>, avatar_url: string) => {
    setLoadingSave(true);
    // Call update profile function from supabase service
    try {
        await updateProfile({ username: userName, bio: bio, avatar_url: avatar_url } as Profile);
        reloadProfile();
        Alert.alert("Success", "Profile updated successfully.");
        setVisible(false);
    } catch (error) {
        Alert.alert("Error", "There was an error updating your profile. Please try again.");
    } finally {
        setLoadingSave(false);
    }
}


const EditProfileModal = ({ visible, setVisible, userName: prevUsername, bio: prevBio, avatar_url: prevAvatar_url, reloadProfile }: EditProfileModalProps) => {

    const [userName, setUserName] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const [avatar_url, setAvatarUrl] = useState<string>('');
    const [loadingSave, setLoadingSave] = useState<boolean>(false);

    useEffect(() => {
        if (visible) {
            setUserName(prevUsername);
            setBio(prevBio);
            setAvatarUrl(prevAvatar_url || 'https://cdn-icons-png.flaticon.com/512/708/708862.png');
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
                        <LabelInput className='w-full p-4' placeholder='Username' label='Username' setValue={setUserName} value={userName} />
                        <LabelInput className='w-full p-4' placeholder='Profile URL' label='Profile Picture URL' value={avatar_url} setValue={setAvatarUrl} multiline={true}/>
                        <LabelInput className='w-full h-32 p-4' placeholder='Rating System' label='Rating System' value={bio} setValue={setBio} multiline={true} />
                        

                        {loadingSave ? (<ActivityIndicator size="large" color="#0000ff" className='absolute bottom-10' />) : 
                        <Pressable className='bg-purple-700 rounded-full px-8 py-4 absolute bottom-10' onPress={() => handleSave(userName, bio, setLoadingSave, setVisible, reloadProfile, avatar_url)}>
                            <Text className='text-white text-lg font-bold'>Save</Text>
                        </Pressable>}

                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    )
}

export default EditProfileModal
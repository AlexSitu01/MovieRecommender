import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

interface Props{
    title: string;
}

const SearchBarSuggestions = ({title} : Props) => {
  return (
    <View className='border-slate-600 py-1.5 border-b-2 rounded-md'>
      <Text className='text-white font-bold'>{title}</Text>
    </View>
  )
}

export default SearchBarSuggestions

const styles = StyleSheet.create({})
import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Account from '@/components/Account'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/services/supabase'
import Auth from '@/components/Auth'


const Profile = () => {
  const [session, setSession] = useState<Session | null>(null)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <View className='bg-[#020212] flex-1'>
      {session && session.user ? <Account key={session.user.id} session={session} /> : <Auth />}
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({})
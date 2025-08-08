import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validate = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation', 'Email and password are required.');
      return false;
    }
    const ok = /\S+@\S+\.\S+/.test(email);
    if (!ok) {
      Alert.alert('Validation', 'Please enter a valid email.');
      return false;
    }
    return true;
  };

  const onSignIn = async () => {
    if (!validate()) return;
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e) {
      Alert.alert('Sign In Failed', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.primaryBtn} onPress={onSignIn}>
        <Text style={styles.primaryText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.link}>No account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:20, justifyContent:'center', backgroundColor:'#fff' },
  title:{ fontSize:26, fontWeight:'800', marginBottom:18, color:'#111' },
  input:{ backgroundColor:'#f9f9f9', borderWidth:1, borderColor:'#ddd', padding:12, borderRadius:10, marginBottom:12 },
  primaryBtn:{ backgroundColor:'#2563eb', padding:14, borderRadius:10, alignItems:'center', marginTop:6 },
  primaryText:{ color:'#fff', fontWeight:'700' },
  link:{ marginTop:14, textAlign:'center', color:'#2563eb', fontWeight:'700' },
});

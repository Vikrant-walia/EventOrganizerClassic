import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

export default function SignUpScreen({ navigation }) {
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
    if (password.length < 6) {
      Alert.alert('Validation', 'Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const onSignUp = async () => {
    if (!validate()) return;
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      Alert.alert('Success', 'Account created! Please sign in.');
      navigation.replace('SignIn');
    } catch (e) {
      Alert.alert('Sign Up Failed', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password (min 6)"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.primaryBtn} onPress={onSignUp}>
        <Text style={styles.primaryText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('SignIn')}>
        <Text style={styles.link}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:20, justifyContent:'center', backgroundColor:'#fff' },
  title:{ fontSize:26, fontWeight:'800', marginBottom:18, color:'#111' },
  input:{ backgroundColor:'#f9f9f9', borderWidth:1, borderColor:'#ddd', padding:12, borderRadius:10, marginBottom:12 },
  primaryBtn:{ backgroundColor:'#16a34a', padding:14, borderRadius:10, alignItems:'center', marginTop:6 },
  primaryText:{ color:'#fff', fontWeight:'700' },
  link:{ marginTop:14, textAlign:'center', color:'#2563eb', fontWeight:'700' },
});

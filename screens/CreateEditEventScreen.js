import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { addDoc, collection, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebaseConfig';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function CreateEditEventScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const editingEvent = route.params?.event ?? null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title ?? '');
      setDescription(editingEvent.description ?? '');
    }
  }, [editingEvent]);

  const validate = () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Title is required.');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Validation', 'Description is required.');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!auth.currentUser?.uid) {
      Alert.alert('Auth', 'You must be logged in.');
      return;
    }
    if (!validate()) return;

    // Instant nav back to dashboard
    navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });

    // Save in background (fire-and-forget)
    (async () => {
      try {
        if (editingEvent) {
          await updateDoc(doc(db, 'events', editingEvent.id), {
            title: title.trim(),
            description: description.trim(),
          });
        } else {
          await addDoc(collection(db, 'events'), {
            title: title.trim(),
            description: description.trim(),
            createdBy: auth.currentUser.uid,
            createdAt: serverTimestamp(),
          });
        }
      } catch (e) {
        // Non-blocking
        console.log('Save error:', e);
      }
    })();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{editingEvent ? 'Edit Event' : 'Create Event'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Event Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { height: 110, textAlignVertical: 'top' }]}
        placeholder="Event Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Button title={editingEvent ? 'Update Event' : 'Create Event'} onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:20, backgroundColor:'#fff' },
  heading:{ fontSize:24, fontWeight:'800', marginBottom:16, color:'#111' },
  input:{ backgroundColor:'#f9f9f9', borderWidth:1, borderColor:'#ddd', padding:12, borderRadius:10, marginBottom:12 },
});

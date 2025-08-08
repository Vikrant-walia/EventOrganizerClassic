import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { auth, db } from '../config/firebaseConfig';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (!auth.currentUser) return;
    const favRef = collection(db, `users/${auth.currentUser.uid}/favorites`);
    const unsub = onSnapshot(favRef, (snap) => {
      setFavorites(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const removeFavorite = (eventId) => {
    Alert.alert('Remove Favorite', 'Remove this event from favorites?', [
      { text:'Cancel', style:'cancel' },
      {
        text:'Remove', style:'destructive',
        onPress: async () => {
          try { await deleteDoc(doc(db, `users/${auth.currentUser.uid}/favorites`, eventId)); }
          catch (e) { Alert.alert('Error', e.message); }
        }
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity style={{ flex:1 }} onPress={() => navigation.navigate('CreateEditEvent', { event: item })}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc}>{item.description}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.removeBtn]} onPress={() => removeFavorite(item.id)}>
        <Text style={styles.removeText}>💔 Remove from Favorites</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Favorite Events</Text>
      <FlatList
        data={favorites}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No favorites yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#fff', paddingHorizontal:15, paddingTop:10 },
  heading:{ fontSize:26, fontWeight:'800', color:'#111', marginBottom:15 },
  list:{ paddingBottom:40 },
  empty:{ textAlign:'center', marginTop:50, color:'#999' },

  card:{ backgroundColor:'#f9f9f9', padding:15, marginBottom:12, borderRadius:12, elevation:2 },
  cardTitle:{ fontSize:18, fontWeight:'800', marginBottom:6, color:'#111' },
  cardDesc:{ fontSize:14, color:'#555', marginBottom:12 },

  removeBtn:{ backgroundColor:'#ffe6ea', paddingVertical:10, borderRadius:8, alignItems:'center' },
  removeText:{ fontSize:14, fontWeight:'700', color:'#b91c1c' },
});

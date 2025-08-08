// screens/DashboardScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, db } from '../config/firebaseConfig';
import { collection, onSnapshot, query, orderBy, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const [events, setEvents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setEvents(rows);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!auth.currentUser) return;
    const favCol = collection(db, `users/${auth.currentUser.uid}/favorites`);
    const unsub = onSnapshot(favCol, (snap) => setFavorites(snap.docs.map((d) => d.id)));
    return unsub;
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          signOut(auth).catch((e) => Alert.alert('Error', e.message));
        },
      },
    ]);
  };

  const toggleFavorite = async (event) => {
    if (!auth.currentUser) return;
    const isFav = favorites.includes(event.id);
    if (isFav) {
      Alert.alert('Remove Favorite', 'Remove this event from favorites?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, `users/${auth.currentUser.uid}/favorites`, event.id));
            } catch (e) {
              Alert.alert('Error', e.message);
            }
          },
        },
      ]);
    } else {
      try {
        await setDoc(doc(db, `users/${auth.currentUser.uid}/favorites`, event.id), event);
      } catch (e) {
        Alert.alert('Error', e.message);
      }
    }
  };

  const confirmDeleteEvent = (eventId) => {
    Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'events', eventId));
          } catch (e) {
            Alert.alert('Error', e.message);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => {
    const isFav = favorites.includes(item.id);
    const isOwner = item.createdBy === auth.currentUser?.uid;

    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => navigation.navigate('CreateEditEvent', { event: item })}
        >
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDesc}>{item.description}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.favBtn, isFav && styles.favBtnActive]}
          onPress={() => toggleFavorite(item)}
        >
          <Text style={styles.favBtnText}>
            {isFav ? '💔 Remove from Favorites' : '❤️ Add to Favorites'}
          </Text>
        </TouchableOpacity>

        {isOwner && (
          <View style={styles.ownerRow}>
            <TouchableOpacity
              style={styles.ownerBtn}
              onPress={() => navigation.navigate('CreateEditEvent', { event: item })}
            >
              <Text style={styles.ownerBtnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.ownerBtn, { backgroundColor: '#fee2e2' }]}
              onPress={() => confirmDeleteEvent(item.id)}
            >
              <Text style={[styles.ownerBtnText, { color: '#b91c1c' }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Dashboard</Text>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No events yet. Create one!</Text>}
      />

      {/* Create Event Button */}
      <TouchableOpacity
        style={styles.createBtn}
        onPress={() => navigation.navigate('CreateEditEvent')}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.createBtnText}>Create Event</Text>
      </TouchableOpacity>

      {/* Floating Favorites Screen Button */}
      <TouchableOpacity
        style={styles.floatingFavBtn}
        onPress={() => navigation.navigate('Favorites')}
      >
        <Ionicons name="heart" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Floating Logout Button */}
      <TouchableOpacity style={styles.floatingLogoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 15 },
  heading: { fontSize: 26, fontWeight: '800', color: '#111', marginTop: 15, marginBottom: 10 },

  list: { paddingBottom: 160 },
  empty: { textAlign: 'center', marginTop: 50, color: '#999' },

  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: '800', marginBottom: 6, color: '#111' },
  cardDesc: { fontSize: 14, color: '#555', marginBottom: 12 },

  favBtn: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  favBtnActive: { backgroundColor: '#ffe6ea' },
  favBtnText: { fontSize: 14, fontWeight: '700', color: '#333' },

  ownerRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  ownerBtn: {
    backgroundColor: '#e5f2ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  ownerBtnText: { color: '#1d4ed8', fontWeight: '700' },

  createBtn: {
    position: 'absolute',
    left: 15,
    right: 90,
    bottom: 20,
    backgroundColor: '#22c55e',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 4,
  },
  createBtnText: { color: '#fff', fontWeight: '800' },

  floatingFavBtn: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },

  floatingLogoutBtn: {
    position: 'absolute',
    left: 18,
    bottom: 18,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
});

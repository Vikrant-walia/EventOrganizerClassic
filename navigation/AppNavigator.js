// navigation/AppNavigator.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { Provider as PaperProvider } from 'react-native-paper';

import { auth } from '../config/firebaseConfig';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CreateEditEventScreen from '../screens/CreateEditEventScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false); // toggle for theme

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  return (
    <PaperProvider theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
        <Stack.Navigator>
          {user ? (
            <>
              <Stack.Screen
                name="Dashboard"
                options={{ headerShown: false }}
              >
                {props => <DashboardScreen {...props} setIsDarkMode={setIsDarkMode} />}
              </Stack.Screen>
              <Stack.Screen
                name="CreateEditEvent"
                component={CreateEditEventScreen}
                options={{ title: 'Create or Edit Event' }}
              />
              <Stack.Screen
                name="Favorites"
                component={FavoritesScreen}
                options={{ title: 'Favorite Events' }}
              />
            </>
          ) : (
            <>
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

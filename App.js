import React, { useEffect, useState } from "react";
import { View, Text, PermissionsAndroid } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import Geolocation from 'react-native-geolocation-service';

async function requestPermissions() {
  if (Platform.OS === 'ios') {
    const auth = await Geolocation.requestAuthorization("whenInUse");
  }
  if (Platform.OS === 'android') {
  await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  }
}


function App() {
  const [locations, setLocations] = useState([]);
  let _watchId;

  useEffect(() => { requestPermissions(); });
  useEffect(() => {
    _watchId = Geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocations([...locations, { latitude, longitude }]);
      },
      error => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 0.5,
        interval: 500,
        fastestInterval: 200,
      },
    );
  }, [locations]);

  useEffect(() => {
    return () => {
      if (_watchId !== null) {
        Geolocation.clearWatch(_watchId);
      }
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {locations.length > 0 && (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: locations[0].latitude,
            longitude: locations[0].longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          {locations.map((location, index) => (
            <Marker
              key={`location-${index}`}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
            />
          ))}
        </MapView>
      )}
    </View>
  );
}

export default App;

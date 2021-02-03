import React, { useEffect, useState } from "react";
import { View, Text, PermissionsAndroid } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import Geolocation from 'react-native-geolocation-service';
import { registerRootComponent } from "expo";
import XYdata from './data.json';

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

//proj4
  var proj4 = require("proj4")

  const epsg5186 = "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs";
  const wgs84 = "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees";

  XYdata.DATA.map((item)=>{
    console.log(`X좌표 : ${item.xce} / Y좌표 : ${item.yce}`);
    var new_data = proj4(epsg5186, wgs84, [item.xce, item.yce]);
    console.log(`위도,경도 : ${new_data}`);
  }) 
  // 이 좌표에 위도, 경도를 새로운 json파일로 만들어야함
//proj4
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

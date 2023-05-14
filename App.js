import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import Constants from "expo-constants";
const L_T = 'location-tracking';

var l1;
var l2;

function UserLocation() {
    const [logStart, setLocationStarted] = React.useState(false);

    const startLocationTracking = async () => {
        await Location.startLocationUpdatesAsync(L_T, {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 60000,
            distanceInterval: 0,
        });
        const hasStarted = await Location.hasStartedLocationUpdatesAsync(
            L_T
        );
        setLocationStarted(hasStarted);
        console.log('logging started', hasStarted);
    };
    React.useEffect(() => {
        const expoConfig = async () => {
            let resf = await Location.requestForegroundPermissionsAsync();
            let resb = await Location.requestBackgroundPermissionsAsync();
            if (resf.status != 'granted' && resb.status !== 'granted') {
                console.log('Permission to access location was denied');
            } else {
                console.log('Permission to access location granted');
            }
        };

        expoConfig();
    }, []);

    const startLocation = () => {
      
        startLocationTracking();
    }

    const stopLocation = () => {
        setLocationStarted(false);
        TaskManager.isTaskRegisteredAsync(L_T)
            .then((tracking) => {
                if (tracking) {
                    Location.stopLocationUpdatesAsync(L_T);
                }
            })
    }


    return (
        <View>
          {logStart ?
              <TouchableOpacity onPress={stopLocation}>
                  <Text style={styles.btnTextDanger}>Stop Ride</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity onPress={startLocation}>
                  <Text style={styles.btnText}>Start Ride</Text>
              </TouchableOpacity>
          }
        </View>
    );
}

const styles = StyleSheet.create({
  btnText: {
    fontSize: 50,
    backgroundColor: 'green',
    color: 'white',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: '70%',
    width:'80%',
    marginLeft:'10%',
},
btnTextDanger: {
  fontSize: 50,
    backgroundColor: 'red',
    color: 'white',
    paddingHorizontal: 30,
  paddingVertical: 10,
    borderRadius: 20,
    marginTop: '70%',
    width:'80%',
    marginLeft:'10%',
},
});

TaskManager.defineTask(L_T, async ({ data, error }) => {
    if (error) {
        console.log('L_T task ERROR:', error);
        return;
    }
    if (data) {
        const { locations } = data;
        let speed = locations[0].coords.speed.toFixed(2);
        let lat = locations[0].coords.latitude;
        let long = locations[0].coords.longitude;

        l1 = lat;
        l2 = long;

        console.log(new Date(Date.now()).toLocaleString());
        //console.log('Lat: '+lat);
        //console.log('Lon: '+long);
        //console.log('Speed: '+speed);
        const postLocationData=async (lat,long,speed)=>{
          const { manifest } = Constants;
const uri = `http://${manifest.debuggerHost.split(':').shift()}/fastmovebackend`;
const API_URL =  uri
          console.log(lat+'/'+long+'/'+speed)
          var config = {
            method: 'POST',
            url: `${API_URL}/storelogs.php`,
        };
        const data = { lat: lat, long: long,speed:speed,schdule_id:3,bus_id:1};
        const options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
       
        try {
            const response = await fetch(`${API_URL}/storelogs.php`, options);
            const json = await response.json();
            console.log(json);
        } catch (error) {
            console.error(error);
        }
         
      }
      postLocationData(lat,long,speed);
    }
});

export default UserLocation;

import axios from "axios"
import { useNavigation } from '@react-navigation/native';
import Constants from "expo-constants";

const { manifest } = Constants;

const uri = `http://${manifest.debuggerHost.split(':').shift()}/fastmovebackend`;

export const API_URL =  uri

export const postLocationData=async (lat,long,speed)=>{
    const navigation = useNavigation();
    const { lat } = props.route.params;
    const { long } = props.route.params;
    const { speed } = props.route.params;
    
    var config = {
      method: 'POST',
      url: `${API_URL}/storelogs.php`,
  };
  const data = { lat: l1, long: l2 };
  const options = {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  };
  try {
      const response = await fetch(apiUrl, options);
      const json = await response.json();
      console.log(json);
  } catch (error) {
      console.error(error);
  }
}
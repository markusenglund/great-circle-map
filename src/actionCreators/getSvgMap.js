import axios from 'axios';
import { feature } from 'topojson-client';

// Get the topojson-data that describes the svg globe projection
export default function getSvgMap() {
  return dispatch => {
    axios.get('/world-110m.json').then(res => {
      dispatch({
        type: 'GET_SVG_MAP',
        data: feature(res.data, res.data.objects.land)
      });
    });
  };
}

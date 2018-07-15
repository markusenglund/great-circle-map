import fetch from 'unfetch';
import { feature } from 'topojson-client';

// Get the topojson-data that describes the svg globe projection
export default function getSvgMap() {
  return dispatch => {
    fetch('/world-110m.json')
      .then(r => r.json())
      .then(data => {
        dispatch({
          type: 'GET_SVG_MAP',
          data: feature(data, data.objects.land)
        });
      });
  };
}

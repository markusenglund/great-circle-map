import React from 'react';
import renderer from 'react-test-renderer';

import SectorElement from '.';

it('renders correctly with missing icao', () => {
  const props = {
    sector: [{ iata: 'AAA' }, { iata: 'BBB', icao: 'BBBB' }],
    distance: '1337 km',
    label: 'icao'
  };
  const tree = renderer.create(<SectorElement {...props} />).toJSON();
  expect(tree).toMatchSnapshot();
});

const { getBrighterColor } = require('./colorSelector.js');
// const { getAirports, getSectors, getGlobePosition } = require('./routeSelectors');

describe('getBrighterColor()', () => {
  it('brightens dark color', () => {
    expect(getBrighterColor({ router: { query: { color: '#000000' } } })).toBe('#141414');
  });
  it('turns C0FEFE to d4ffff', () => {
    expect(getBrighterColor({ router: { query: { color: '#C0FEFE' } } })).toBe('#d4ffff');
  });
});

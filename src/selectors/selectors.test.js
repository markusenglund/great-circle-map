const { getBrighterColor } = require('./colorSelector.js');

describe('getBrighterColor()', () => {
  it('brightens dark color', () => {
    expect(getBrighterColor({ settings: { routeColor: '#000000' } })).toBe('#141414');
  });
  it('turns C0FEFE to d4ffff', () => {
    expect(getBrighterColor({ settings: { routeColor: '#C0FEFE' } })).toBe('#d4ffff');
  });
});

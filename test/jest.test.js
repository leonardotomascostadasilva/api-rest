/* eslint-disable linebreak-style */
test('Devo conhecer as principais  assertivas do jest', () => {
  const number = null;
  expect(number).toBeNull();
});

test('Devo saber trabalhar com objr', () => {
  const obj = { name: 'Leonardo', age: 24 };
  expect(obj).toHaveProperty('name');
  expect(obj).toHaveProperty('age', 24);
});

/* eslint-disable linebreak-style */
test('Devo conhecer as principais  assertivas do jest', () => {
  const number = null;
  expect(number).toBeNull();
});

test('Devo saber trabalhar com objr', () => {
  const obj = { name: 'Jhon', age: 12 };
  expect(obj).toHaveProperty('name');
  expect(obj).toHaveProperty('age', 12);
});

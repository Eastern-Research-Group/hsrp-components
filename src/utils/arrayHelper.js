/* eslint-disable import/prefer-default-export */
export const toggleArrayItem = (array, item) => {
  const index = array.indexOf(item);
  if (index > -1) {
    array.splice(index, 1);
  } else {
    array.push(item);
  }
  return array;
};

export const joinArray = (array, prop, joiner = ', ') => array.map((v) => v[prop]).join(joiner);

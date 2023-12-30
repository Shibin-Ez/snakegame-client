export const restart = ({ initiate }) => {
  initiate();
};

let key = "";

export const getKey = () => {
  return key;
};

export const setKey = (newKey) => {
  key = newKey;
};
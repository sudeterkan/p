export const generatePinCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

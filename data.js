
const getDataGenerator = (initialValue = 3000000) => {
  let currentValue = initialValue;

  return (limit = 1) => {
    const result = [];
    const currentTime = new Date().getTime();

    for (let i = 0; i < limit; i++) {
      const delta = Math.floor(Math.random() * 10000) - 5000;
      currentValue = currentValue + delta;
      result.push({ value: currentValue, timestamp: currentTime - ((limit - i) * 500) }); // value per 500ms
    }

    return result;
  };
};

const generator = getDataGenerator();

module.exports = {
  get: generator,
};

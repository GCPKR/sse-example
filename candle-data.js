const getRandomValue = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const getDataGenerator = (initialValue = 3000000) => {
  let lastValue = initialValue;

  return (limit = 1) => {
    const result = [];
    const currentTime = new Date().getTime();

    for (let i = 0; i < limit; i++) {
      const open = lastValue;
      const availableMinValue = Math.max(0, lastValue - 100000);
      const availableMaxValue = Math.min(lastValue + 100000, Number.MAX_VALUE);
      const close = getRandomValue(availableMinValue, availableMaxValue);
      const low = getRandomValue(availableMinValue, Math.min(open, close));
      const high = getRandomValue(Math.max(open, close), availableMaxValue);
      lastValue = close;
      result.push({ open, close, low, high, timestamp: currentTime - ((limit - i) * 500) }); // value per 500ms
    }

    return result;
  };
};

const generator = getDataGenerator();

module.exports = {
  get: generator,
};

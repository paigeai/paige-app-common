const textToDateString = s => {
  const date = new Date(s);

  if (Number.isNaN(Number(date))) {
    const parts = s.split(' ');

    if (parts.length !== 3) {
      return null;
    }

    const now = new Date();

    const number = Number(parts[0]);
    const type = parts[1];

    if (type === 'hours' || type === 'hour') {
      now.setHours(now.getHours() - number);
    } else if (type === 'minutes' || type === 'minute') {
      now.setMinutes(now.getMinutes() - number);
    } else if (type === 'days' || type === 'day') {
      now.setHours(now.getHours() - 24 * number);
    }

    return now.toUTCString();
  }

  return date.toUTCString();
};

module.exports = {
  textToDateString,
};

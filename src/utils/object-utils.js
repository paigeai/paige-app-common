const getSharedProperties = (props, items, obj) =>
  props.filter(p => {
    if (Array.isArray(items)) {
      return items.findIndex(item => item[p] === obj[p]) !== -1;
    }

    return items[p] === obj[p];
  });

module.exports = {
  getSharedProperties,
};

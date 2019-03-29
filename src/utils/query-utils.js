const getOffset = (req, pageSize) => {
  if (req.query.page === undefined) {
    return 0;
  }

  const page = Number(req.query.page);

  if (!Number.isInteger(page) || page < 1) {
    return 0;
  }

  return (page - 1) * pageSize;
};

module.exports = {
  getOffset,
};

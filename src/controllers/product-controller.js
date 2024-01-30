exports.getProductsLanding = (req, res, next) => {
  res.json({ message: "Get Product Landing Page" });
};

exports.getProducts = (req, res, next) => {
  const { promotion, brand, collection, series } = req.query;
  res.json({ promotion, brand, collection, series });
};

exports.getProductById = (req, res, next) => {
  const { productId } = req.params;
  res.json({ productId });
};

export const notFoundHandler = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ success: false, message: err.message });
  } else {
    next(err);
  }
};
export const badRequestHandler = (err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send(err.errorsList);
  } else {
    next();
  }
};
export const forbidenHandler = (err, req, res, next) => {
  if (err.status === 403) {
    res.status(403).send({ success: false, message: err.message });
  } else {
    next();
  }
};
export const genericErrorHandler = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ success: false, message: "generic error" });
};

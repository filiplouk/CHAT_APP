const errorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError" || err.name === "CastError") {
    // Handle validation and cast errors
    return res.status(400).send(err.message);
  } else if (err.name === "MongoError" || err.name === "MongoNetworkError") {
    // Handle MongoDB errors
    console.log(err);
    return res.status(500).send("Error connecting to the database");
  } else {
    // Handle unexpected errors
    console.log(err);
    return res.status(500).send(err.message);
  }
};

module.exports = errorHandler;

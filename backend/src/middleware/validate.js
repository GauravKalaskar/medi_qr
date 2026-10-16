const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.body = parsed;
    next();
  } catch (error) {
    if (error.errors) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please check your inputs.',
        errors: formattedErrors,
      });
    }
    return res.status(400).json({ success: false, message: 'Invalid input payload.' });
  }
};

module.exports = validate;

export function requireUser(req, res, next) {
  const userId = req.header('x-user-id') || req.query.userId;
  if (!userId || userId.length < 3 || userId.length > 100) {
    return res.status(401).json({ success: false, message: 'A valid x-user-id header is required.' });
  }
  req.userId = userId.trim();
  next();
}

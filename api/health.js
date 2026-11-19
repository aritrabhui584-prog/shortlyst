export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Use GET.'
    });
  }

  return res.status(200).json({
    status: 'ok'
  });
}

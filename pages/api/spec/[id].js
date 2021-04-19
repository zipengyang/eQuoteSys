export default function userHandler(req, res) {
  const {
    query: { id, quantity },
    method,
  } = req;

  switch (method) {
    case 'GET':
      // Get data from your database
      res.status(200).json({ id, quantity: `Spec ${id}` });
      break;
    case 'PUT':
      // Update or create data in your database
      res.status(200).json({ id, quantity: 22 || `Spec ${id}` });
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

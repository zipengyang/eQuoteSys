// Fake users data
const specs = [{ id: 1, quantity: 10, layer: 4 }];

export default function handler(req, res) {
  // Get data from your database
  res.status(200).json(specs);
}

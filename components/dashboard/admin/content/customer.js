import CustomerTable from '../CustomersTableNew';

export default function Customer({ data }) {
  return (
    <div>
      <CustomerTable data={data} />
    </div>
  );
}

import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from '@material-ui/data-grid';
import { useQuery } from 'react-query';
import { getAllCamps } from '../../pages/api/getSpec';

const columns = [
  { field: 'id', headerName: 'ID', width: 120 },
  { field: 'name', headerName: 'Campaign name', width: 200 },
  { field: 'type', headerName: 'Type', width: 200 },
  {
    field: 'startedDate',
    headerName: 'Start Date',
    type: 'date',
    width: 120,
  },
  {
    field: 'expiredDate',
    headerName: 'Expired Date',
    type: 'date',
    width: 135,
  },
  {
    field: 'description',
    headerName: 'Description',
    sortable: false,
    width: 160,
  },
  {
    field: 'offer',
    headerName: 'Offer',
    type: 'number',
    width: 90,
  },
];
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}
export default function CampaignSelectList({ handleCampSubmit }) {
  const handleClick = (data) => {
    handleCampSubmit(data);
  };
  const { data, status } = useQuery('camps', getAllCamps);
  if (status === 'loading') return 'loading';
  if (status === 'error') return 'error';

  return (
    <div style={{ height: 580, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={10}
        //   checkboxSelection
        onRowClick={(param) => handleClick(param.row)}
        // components={{
        //   Toolbar: CustomToolbar,
        // }}
      />
    </div>
  );
}

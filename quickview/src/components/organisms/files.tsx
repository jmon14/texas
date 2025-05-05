// Entity
import { FileEntity } from '../../../ultron-api/api';

// Components
import FullCenter from '../atoms/center';
import Panel from '../atoms/panel';
import Table from '../molecules/table';

const Files = () => {
  const rows: FileEntity[] = [{ uuid: 'uuid', url: 'test url', key: 'test key' }];

  return (
    <FullCenter>
      <Panel>
        <Table rows={rows}></Table>
      </Panel>
    </FullCenter>
  );
};

export default Files;

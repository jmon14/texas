// Entity
import { FileEntity } from '../../../backend-api/api';

// Components
import FullCenter from '../atoms/center';
import Panel from '../atoms/panel';
import Table from '../molecules/table';

/**
 * Files component - Display uploaded files in a table format.
 *
 * Shows a table of uploaded files with UUID, URL, and key information.
 * Currently displays mock data but designed to integrate with file management
 * API. Provides a centered, paneled view of file records.
 *
 * @component
 * @example
 * ```tsx
 * Basic usage in route
 * <Route path="/files" element={<Files />} />
 * ```
 *
 * @example
 * In dashboard
 * ```tsx
 * <DashboardLayout>
 *   <Typography variant="h4">Your Files</Typography>
 *   <Files />
 * </DashboardLayout>
 * ```
 *
 * @returns {JSX.Element} Rendered files table
 *
 * @remarks
 * Current implementation:
 * - Shows mock data (TODO: Integrate with API)
 * - Displays uuid, url, and key columns
 * - Centered layout with panel wrapper
 * - Uses generic Table component for rendering
 *
 * Future enhancements:
 * - Fetch files from API
 * - Add file actions (download, delete)
 * - Add pagination for large file lists
 * - Add file type icons
 * - Add file size and upload date
 */
const Files = () => {
  const rows: FileEntity[] = [
    { uuid: 'uuid', url: 'test url', name: 'test name', size: 100, user: 'test user' },
  ];

  return (
    <FullCenter>
      <Panel>
        <Table rows={rows}></Table>
      </Panel>
    </FullCenter>
  );
};

export default Files;

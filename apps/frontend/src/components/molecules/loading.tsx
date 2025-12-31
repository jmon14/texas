// External libraries
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

// Store
import { useAppSelector } from '../../hooks/store-hooks';

// Constants
import { FetchStatus } from '../../constants';

const Loading = () => {
  const { status } = useAppSelector((state) => state.user);

  return (
    // TODO - Review aria-hidden setting for testing
    <Backdrop aria-hidden="false" open={status === FetchStatus.LOADING}>
      <CircularProgress />
    </Backdrop>
  );
};

export default Loading;

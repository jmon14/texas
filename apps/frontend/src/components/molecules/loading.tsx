// External libraries
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

// Store
import { useAppSelector } from '../../hooks/store-hooks';

// Constants
import { FetchStatus } from '../../constants';

/**
 * Loading component displaying a fullscreen loading indicator.
 *
 * Monitors Redux user state and shows a backdrop with circular progress spinner
 * when the user fetch status is LOADING. Automatically appears/disappears based
 * on global loading state. Uses Material-UI Backdrop for fullscreen overlay.
 *
 * @component
 * @example
 * ```tsx
 * Basic usage in App component
 * function App() {
 *   return (
 *     <>
 *       <Loading />
 *       <Routes>
 *         <Route path="/" element={<Home />} />
 *       </Routes>
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * In layout wrapper
 * ```tsx
 * <Box>
 *   <Loading />
 *   <AppBar />
 *   <Drawer />
 *   <MainContent />
 * </Box>
 * ```
 *
 * @returns {JSX.Element} Rendered loading backdrop (visible when user state is loading)
 */
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

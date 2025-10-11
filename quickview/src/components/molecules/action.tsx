import { useEffect, useMemo, useState } from 'react';
import { Box, debounce, styled, TextField, Typography, useTheme } from '@mui/material';
import { ActionDto } from '../../../ultron-api/api';
import { ActionColor } from '../../constants';
import { blueGrey, grey } from '@mui/material/colors';

const ActionTextField = styled(TextField)(() => ({
  '& input': {
    padding: '0px',
    textAlign: 'center',
  },
  '&.MuiTextField-root': {
    borderRadius: '4px',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'purple',
  },
}));

type ActionProps = {
  initialAction: ActionDto;
  color?: string;
  onChange: (updatedAction: ActionDto) => void;
};

const ActionComponent = ({ initialAction, onChange }: ActionProps) => {
  const theme = useTheme();
  const [action, setAction] = useState(initialAction);
  const [percentage, setPercentage] = useState(action.percentage.toString());

  useEffect(() => {
    setAction(initialAction);
    setPercentage(initialAction.percentage.toString());
  }, [initialAction]);

  const handlePercentageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newPercentage = parseFloat(event.target.value);
    if (isNaN(newPercentage)) {
      setPercentage(event.target.value);
      debouncedOnChange({ ...action, percentage: 0 });
      return;
    }
    if (newPercentage > 100) {
      newPercentage = 100;
    } else if (newPercentage < 0) {
      newPercentage = 0;
    }
    setPercentage(newPercentage.toString());
    debouncedOnChange({ ...action, percentage: newPercentage });
  };

  const debouncedOnChange = useMemo(() => debounce(onChange, 300), [onChange]);

  return (
    <Box
      sx={{
        backgroundColor: ActionColor[action.type],
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: 2,
        borderRadius: 1,
        display: 'flex',
        paddingTop: 2,
        gap: 0.5,
      }}
    >
      <Typography color={(theme) => theme.palette.common.white} variant="h5">
        {action.type}
      </Typography>
      <ActionTextField
        size="small"
        value={percentage}
        onChange={handlePercentageChange}
        sx={{
          width: '40px',
          backgroundColor: theme.palette.mode === 'light' ? grey[100] : blueGrey[800],
        }}
      />
    </Box>
  );
};

export default ActionComponent;

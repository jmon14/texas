import { useEffect, useMemo, useState } from 'react';
import { Box, debounce, styled, TextField, Typography, useTheme } from '@mui/material';
import { ActionDto } from '../../../backend-api/api';
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
  const [frequency, setFrequency] = useState(action.frequency.toString());

  useEffect(() => {
    setAction(initialAction);
    setFrequency(initialAction.frequency.toString());
  }, [initialAction]);

  const handleFrequencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newFrequency = parseFloat(event.target.value);
    if (isNaN(newFrequency)) {
      setFrequency(event.target.value);
      debouncedOnChange({ ...action, frequency: 0 });
      return;
    }
    if (newFrequency > 100) {
      newFrequency = 100;
    } else if (newFrequency < 0) {
      newFrequency = 0;
    }
    setFrequency(newFrequency.toString());
    debouncedOnChange({ ...action, frequency: newFrequency });
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
        value={frequency}
        onChange={handleFrequencyChange}
        sx={{
          width: '40px',
          backgroundColor: theme.palette.mode === 'light' ? grey[100] : blueGrey[800],
        }}
      />
    </Box>
  );
};

export default ActionComponent;

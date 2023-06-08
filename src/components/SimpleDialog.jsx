import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { DialogContent, DialogContentText, DialogActions } from '@mui/material';

export const SimpleDialog = (props) => {
  const { onSubmit, onCancel, open, carInfo } = props;

  return (
    <Dialog onClose={onCancel} open={open}>
      <DialogTitle>Назначить бригаду {carInfo?.name} на вызов</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`Растсояние до точки: ${carInfo?.distance}`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Отмена</Button>
        <Button onClick={() => onSubmit(carInfo)}>Назначить</Button>
      </DialogActions>
    </Dialog>
  );
};

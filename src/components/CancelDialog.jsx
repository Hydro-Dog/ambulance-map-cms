import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { DialogContent, DialogContentText, DialogActions } from '@mui/material';

export const CancelDialog = (props) => {
  const { onSubmit, onCancel, open, carInfo } = props;

  return (
    <Dialog onClose={onCancel} open={open}>
      <DialogTitle>Отменить заказ для бригады {carInfo?.name}?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`Растсояние до точки: ${carInfo?.distance}`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Назад</Button>
        <Button onClick={() => onSubmit(carInfo)}>Отменить заказ</Button>
      </DialogActions>
    </Dialog>
  );
};

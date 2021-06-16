import React, { useState } from 'react';
import { Button, IconButton } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Input as InputIcon } from '@material-ui/icons';
// import Paper from '@material-ui/core/Paper';
// import Draggable from 'react-draggable';

// function PaperComponent(props) {
//   return (
//     <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
//       <Paper {...props} />
//     </Draggable>
//   );
// }

const ConfirmModal = (props) => {
  // const [open, setOpen] = useState(false);
  const { content, children, open, setOpen, onConfirm } = props

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  return (
    // <div>
    //   <Button variant="outlined" color="primary" onClick={handleClickOpen}>
    //     <InputIcon />
    //   </Button>
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      // PaperComponent={PaperComponent}
      aria-labelledby="dialog-title"
    >
      {/* <DialogTitle style={{ cursor: 'move' }} id="dialog-title">
        {title}
      </DialogTitle> */}
      <DialogContent>
        <DialogContentText>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => setOpen(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={() => {
                                setOpen(false)
                                onConfirm()
                              }}
                color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
    // </div>
  );
}

export default ConfirmModal
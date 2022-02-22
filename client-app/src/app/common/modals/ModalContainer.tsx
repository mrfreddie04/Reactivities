import React from 'react';
import { Modal } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores/store';

function ModalContainer() {
  const { modalStore: { modal, closeModal } } = useStore();

  if(!modal.open)
    return null;

  return (
    <Modal open={modal.open} onClose={closeModal} size='mini'>      
      <Modal.Content>
        {modal.body}
      </Modal.Content>
    </Modal>      
  );
}

export default observer(ModalContainer);
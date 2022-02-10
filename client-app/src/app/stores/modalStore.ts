import { makeAutoObservable } from "mobx";

interface Modal {
  open: boolean;
  body: JSX.Element | null;
}

export default class ModalStore {
  public modal: Modal = {
    open: false,
    body: null
  };

  constructor() {
    makeAutoObservable(this);  
  }

  public openModal = (content: JSX.Element) => {
    this.modal.open = true;
    this.modal.body = content;
  }

  public closeModal = () => {
    this.modal.open = false;
    this.modal.body = null;
  }
}    
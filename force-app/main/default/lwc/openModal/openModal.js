import { LightningElement } from 'lwc';

export default class OpenModal extends LightningElement {
     isShowModal = false;

    showModalBox() {  
        this.isShowModal = true;
    }

    hideModalBox() {  
        this.isShowModal = false;
    }
}
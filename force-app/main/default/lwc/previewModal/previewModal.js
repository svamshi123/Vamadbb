import { LightningElement,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getPdfUrl from '@salesforce/apex/PreviewModalCtrl.getAppPdfUrl';


export default class PreviewModal extends LightningElement {
    @api parentRecord;
    @api modalTitle;
    @api isPreviewModalOpen;
    isRenderCallbackActionExecuted = false;
    appPDFUrl;
    connectedCallback(){
    }
    hideModalBox(){
        this.isPreviewModalOpen = false;
        this.dispatchEvent(
            new CustomEvent('modalopen',
                {
                    bubbles: true,
                    detail: {
                        isModalOpen : true
                    }
                }
            )
        );
    }
    renderedCallback(){
        if (this.isRenderCallbackActionExecuted === true) {
            return;
        }
        this.isRenderCallbackActionExecuted = true;
        getPdfUrl({appId: this.parentRecord}).then((data) =>{
            this.appPDFUrl = data;
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error!',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }
}
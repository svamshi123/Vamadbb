import { LightningElement ,api,track} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import deleteSingleAttachment from '@salesforce/apex/OtherFundingResourceCtrl.deleteSingleAttachment';
import documentCreate from '@salesforce/apex/OtherFundingResourceCtrl.createDocument';
import getDocWithType from '@salesforce/apex/OtherFundingResourceCtrl.getDocWithType';

export default class UploadDocuments extends LightningElement {
    @api labelName;
    @api parentRecord;
    @track fileuploaded =[];

    connectedCallback(){
        this.getApplicationDoc();
    }
    handleUploadFinished(event){
        const uploadedFiles = event.detail.files;
        let uploadedFileIds = '';
        for (let i = 0; i < uploadedFiles.length; i++) {
            uploadedFileIds += uploadedFiles[i].documentId + ',';
        }
        let fileNames = uploadedFileIds.split(',');
        this.createDocuments(fileNames);
        
    }
    createDocuments(fileNames){
        documentCreate({type:this.labelName,parId:this.parentRecord}).then((data) =>{
            if(data!=null){
                this.getApplicationDoc();
            }
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body.message,
                    variant: 'error',
                }),
            );           
        });
    }

    getApplicationDoc(){
        getDocWithType({type:this.labelName,appId:this.parentRecord}).then((data) => {
            if(data !== null ){
                this.fileuploaded = JSON.parse(data);
            }
        })
    }
    removeAttachment(event){
        let value = event.target.value;    
        try{       
            deleteSingleAttachment({attchmentID :value})
            .then(result => {
                let arrayIndex = this.fileuploaded.findIndex((doc) => result == doc.docId);
                this.fileuploaded.splice(arrayIndex, 1);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );           
            });
        }catch(error){
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body.message,
                    variant: 'error',
                }),
            );
        }                
    }
}    
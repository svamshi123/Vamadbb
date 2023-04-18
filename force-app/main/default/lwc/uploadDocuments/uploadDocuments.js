import { LightningElement ,api,track} from 'lwc';

import getAttchmentDetails from '@salesforce/apex/OtherFundingResourceCtrl.getAttchmentDetails';
import deleteSingleAttachment from '@salesforce/apex/OtherFundingResourceCtrl.deleteSingleAttachment';

export default class UploadDocuments extends LightningElement {
       @api labelName;
       @api parentRecord;
       @track fileuploaded =[];
       
       handleUploadFinished(event){
        const uploadedFiles = event.detail.files;
        let uploadedFileIds = '';
        for (let i = 0; i < uploadedFiles.length; i++) {
            uploadedFileIds += uploadedFiles[i].documentId + ',';
        }
        let fileNames = uploadedFileIds.split(',');
        getAttchmentDetails({parId: this.parentRecord})
        .then(result => {
            let fileData = JSON.parse(result);
            this.fileuploaded = fileData.filter(obj => fileNames.includes(obj.docId));
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
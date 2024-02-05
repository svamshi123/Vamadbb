import { LightningElement,wire,track,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import fetchAccountId from '@salesforce/apex/uploadDoc.fetchAccountId';
import createFile from '@salesforce/apex/uploadDoc.createFile';

const FILE_REQUIRED = 'no_file';
export default class UploadDoc extends LightningElement {
    @api eotRecord;
    error;
    labelName = 'Upload the Document';
    parentRecord 
    @track rows = [];
    isfileUploded = false;

    connectedCallback(){
        this.getAccountId();
        if(this.rows.length === 0){
            this.rows.push({
                Id: 0,
                controledValue: '',
                fileTitle:'',
                fileData:''
            });
        }
    }

    addRow() {
        let rowId = this.rows.length;
        this.rows.push({ Id: rowId,controledValue:'',contentVersionInfo:'',fileTitle:'',fileData:''});
    }

    getAccountId(){
        fetchAccountId({recId:this.eotRecord}).then((data) =>{
            this.parentRecord = data;
        }).catch((error) =>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        })
    }
    
    handleFileUploaded(event) {
        this.isfileUploded = true;
        let file = event.target.files[0];
        let rowId = event.target.dataset.id;
        let rowIndex = this.rows.findIndex((row) => row.Id == rowId);
        let reader = new FileReader();
        let fileContents;
        reader.onload = e => {
            let base64 = 'base64,';
            let content = reader.result.indexOf(base64) + base64.length;
            fileContents = reader.result.substring(content);
            this.rows[rowIndex]['fileTitle'] = file.name;
            this.rows[rowIndex]['fileData'] = fileContents;
            this.rows[rowIndex]['isfileUploded'] = this.isfileUploded;
        };
        reader.readAsDataURL(file);
    }

    handleDelete(event){
        let rowId = event.target.dataset.id;
        if(this.rows.length > 1 ){
            let rowIndex = this.rows.findIndex((row) => row.Id == rowId);
            this.rows.splice(rowIndex, 1);
            for( let i=0; i<= this.rows.length; i++){
                this.rows[i].Id = i;
            }
        } else {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error deleting record',
                    message: 'You can not delete if it have sigle row. Please update the values',
                    variant: 'info'
                })
            );
        }
        console.log('rows '+JSON.stringify(this.rows));
    }    

    handleSelectedValues(event){
        console.log(JSON.stringify(event.detail));
        this.rows[event.detail.rowIndex]['docCategory'] = event.detail.controllerValue;
        this.rows[event.detail.rowIndex]['docSubCategory'] = event.detail.dependentValue;
    }

    handleSaveAndProceed(){
        console.log('rows '+JSON.stringify(this.rows));
        let checkEmptyVal = [];
        this.rows.forEach(e =>{
            if(e.fileTitle === '' && e.fileData === ''){
                checkEmptyVal.push(FILE_REQUIRED);
            }
        });
        if(checkEmptyVal.includes(FILE_REQUIRED)){
            const emptyEvent = new ShowToastEvent({
                title: 'Error!',
                message: 'Some Files are missing',
                variant: 'error'
            });
            this.dispatchEvent(emptyEvent);
        } else {
            this.UpdatetheContentVersion(this.rows);
        }
    }
    
    UpdatetheContentVersion(obj){
        createFile({objString:JSON.stringify(obj),parentRecord:this.parentRecord}).then((data) =>{
            console.log({data});
        }).catch((error) =>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        })
    }
}
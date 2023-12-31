import { LightningElement,wire,track,api } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import OBJECTA_OBJECT from '@salesforce/schema/ContentVersion';
import DOCUMENT_CATAGORY from '@salesforce/schema/ContentVersion.Document_Category__c'; 

import fetchAccountId from '@salesforce/apex/uploadDoc.fetchAccountId';
import createFile from '@salesforce/apex/uploadDoc.createFile';

const FILE_REQUIRED = 'no_file';
export default class UploadDoc extends LightningElement {
    @api eotRecord;
    docCategorypicvalues;
    subDocCategorypicvalues;
    subCategoryValues;
    error;
    labelName = 'Upload the Document';
    parentRecord 
    docCategoryValue;
    docSubCategoryValue;
    @track rows = [];
    isfileUploded = false;


    columnData = [
        {label: 'Document Category',fieldName:'Document Category'},
        {label: 'Document Sub-Category',fieldName:'Document Sub-Category'},
        {label: 'Uploaded File',fieldName:'Uploaded File'},
    ];

    @wire(getObjectInfo, { objectApiName: OBJECTA_OBJECT })
    objectInfo;

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: DOCUMENT_CATAGORY })
    catagoryPicklistValues({ data, error }) {
        if (data) {
            this.docCategorypicvalues = data.values;
            this.error = undefined;
        }
        if (error) {
            this.error = error;
            this.docCategorypicvalues = undefined;
        }
    }

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
        this.rows.push({ Id: rowId,controledValue:'',contentVersionInfo:''});
    }

    getAccountId(){
        fetchAccountId({recId:this.eotRecord}).then((data) =>{
            this.parentRecord = data;
        }).catch((error) =>{
            console.log('error'+JSON.stringify(error));
        })
    }

    handleCatagory(event){
        try{     
            this.docCategoryValue = event.target.value;
            let rowId = event.target.dataset.id;
            let rowIndex = this.rows.findIndex((row) => row.Id == rowId);
            this.rows[rowIndex]['controledValue'] = this.docCategoryValue;
            this.rows[rowIndex]['docCategory'] = this.docCategoryValue;
            // if(this.template.querySelector('c-lightning-combo-box')){
            //     console.log('this 82');
            //     this.template.querySelector('c-lightning-combo-box').fetchDependentPickListValues(this.rows[rowIndex]['controledValue'],rowIndex);                    
            // }
        }catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        }

    }

    handleSelectedSubCategory(event){
        this.docSubCategoryValue = event.detail.selectedSubCategory;
        let rowId = event.detail.rowId;
        let rowIndex = this.rows.findIndex((row) => row.Id == rowId);
        this.rows[rowIndex]['docSubCategory'] = this.docSubCategoryValue;
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
            console.log({error});
        })
    }
}
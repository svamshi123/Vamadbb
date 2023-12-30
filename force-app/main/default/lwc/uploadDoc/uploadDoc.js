import { LightningElement,wire,track,api } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

import OBJECTA_OBJECT from '@salesforce/schema/ContentVersion';
import DOCUMENT_CATAGORY from '@salesforce/schema/ContentVersion.Document_Category__c'; 
// import DOCUMENT_SUBCATAGORY from '@salesforce/schema/ContentVersion.Document_SubCategory__c'; 

import getDocumentsByParId from '@salesforce/apex/uploadDoc.getDocuments';
import fetchAccountId from '@salesforce/apex/uploadDoc.fetchAccountId';
import deleteSingleAttachment from '@salesforce/apex/uploadDoc.deleteSingleAttachment';
import createFile from '@salesforce/apex/uploadDoc.createFile';

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
    @track fileuploaded =[];
    @track filesUploaded = [];

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

    // @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: DOCUMENT_SUBCATAGORY })
    // subCatagoryPicklistValues({ data, error }) {
    //     if (data) {
    //         this.subCategoryValues = data;
    //         this.error = undefined;
    //     }
    //     if (error) {
    //         this.error = error;
    //         this.subCategoryValues = undefined;
    //     }
    // }

    connectedCallback(){
        // this.getDocCategory();
        // this.getSubDocCategory();
        this.getAccountId();
        if(this.rows.length === 0){
            this.rows.push({
                Id: 0,
                controledValue: '',
                contentVersionInfo:''
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
    // getDocCategory(){
    //     getDocCategoryValues().then((data) =>{
    //         console.log({data});
    //         this.docCatagorypicvalues = data;
    //     }).catch((error) =>{
    //         console.log({error});
    //     })
    // }

    // getSubDocCategory(){
    //     getSubDocCategoryValues().then((data) =>{
    //         console.log({data});
    //         this.subDocCatagorypicvalues = data;
    //     }).catch((error) =>{
    //         console.log({error});
    //     })
    // }

    handleCatagory(event){
        this.docCategoryValue = event.target.value;
        // let key = this.subCategoryValues.controllerValues[event.target.value];
        // this.subDocCategorypicvalues = this.subCategoryValues.values.filter(opt => opt.validFor.includes(key));
        let rowId = event.target.dataset.id;
        let rowIndex = this.rows.findIndex((row) => row.Id == rowId);
        this.rows[rowIndex]['controledValue'] = this.docCategoryValue;
        this.rows[rowIndex]['docCategory'] = this.docCategoryValue;
    }

    handleSelectedSubCategory(event){
        this.docSubCategoryValue = event.detail.selectedSubCategory;
        let rowId = event.detail.rowId;
        let rowIndex = this.rows.findIndex((row) => row.Id == rowId);
        this.rows[rowIndex]['docSubCategory'] = this.docSubCategoryValue;
    }

    
    handleFileUploaded(event) {
        let file = event.target.files[0];
        let rowId = event.target.dataset.id;
        let rowIndex = this.rows.findIndex((row) => row.Id == rowId);
        let reader = new FileReader();
        let fileContents;
        reader.onload = e => {
            let base64 = 'base64,';
            let content = reader.result.indexOf(base64) + base64.length;
            fileContents = reader.result.substring(content);
            this.filesUploaded.push({
                rowIndex : rowIndex,
                fileTitle: file.name, 
                fileData: fileContents,
                docCategory: this.docCategoryValue,
                docSubCategory: this.docSubCategoryValue
            });
            this.rows[rowIndex]['fileTitle'] = file.name;
            this.rows[rowIndex]['fileData'] = fileContents;
            //this.rows[rowIndex]['contentVersionInfo'] = this.filesUploaded[rowIndex];
        };
        reader.readAsDataURL(file);
    }

    handleDelete(){

    }
    
    getDocuments(){
        getDocumentsByParId({accId: this.parentRecord}).then((data) =>{
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

    handleSaveAndProceed(){
        console.log('rows '+JSON.stringify(this.rows));
        //console.log('contentVersionInfo'+JSON.stringify(this.rows[this.rows.length - 1].contentVersionInfo));
        this.UpdatetheContentVersion(this.rows);
    }
    
    UpdatetheContentVersion(obj){
        createFile({objString:JSON.stringify(obj),parentRecord:this.parentRecord}).then((data) =>{
            //this.dispatchEvent(new CustomEvent('nextstage', {'detail' : {'currentScreen':'uploadDocuments'}}));
            console.log({data});
        }).catch((error) =>{
            console.log({error});
        })
    }
}
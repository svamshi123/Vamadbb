import { LightningElement, wire, api, track } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import DOCUMENT_SUB_CATEGORY from '@salesforce/schema/ContentVersion.Document_SubCategory__c'; 
import DOCUMENT_CATEGORY from '@salesforce/schema/ContentVersion.Document_Category__c'; 
import OBJECTA_OBJECT from '@salesforce/schema/ContentVersion';

import getDocCategoryPicklistValues from '@salesforce/apex/uploadDoc.getDocCategoryPicklistValues';

export default class DependentPicklistComponent extends LightningElement {

    @api picklistRowId;
    @api controllerFieldLabel;
    @api dependentFieldLabel;
     
    @api controllerValue;
    @api dependentValue;
    controllingPicklist=[];
    @track finalDependentVal=[];
    
    subCategoryData
    showpicklist = false;
    dependentDisabled=true;
    categoryDefaultValue;
    subCategoryDefaultValue;

    @wire(getObjectInfo, { objectApiName: OBJECTA_OBJECT })
    objectInfo;

    // @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: DOCUMENT_CATEGORY })
    // catagoryPicklistValues({ data, error }) {
    //     if(data){
    //         data.values.forEach(optionData => {
    //             this.controllingPicklist.push({label : optionData.label, value : optionData.value});
    //         });
    //         this.showpicklist = true;
    //     }else if(error){
    //         this.dispatchEvent(
    //             new ShowToastEvent({
    //                 title: 'Error record',
    //                 message: error.body.message,
    //                 variant: 'error'
    //             })
    //         );
    //     }
    // }

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: DOCUMENT_SUB_CATEGORY })
    subCatagoryPicklistValues({ data, error }) {
        if(data){
            this.subCategoryData = data;
        }else if(error){
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        }
    }

    connectedCallback(){
        this.getDocCatePicValues();
    }

    getDocCatePicValues(){
        getDocCategoryPicklistValues().then((date) =>{
            this.controllingPicklist = date;
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

    fetchDependentValue(event){
        this.finalDependentVal = []
        let controllingValue = event.target.value;
        this.controllerValue = controllingValue
        let controllingValueIndex = this.subCategoryData.controllerValues[controllingValue]
        this.finalDependentVal = this.subCategoryData.values.filter(opt => opt.validFor.includes(controllingValueIndex));
        this.dependentDisabled = this.finalDependentVal.length > 0 ? false : true
    }
 
    handleDependentPicklist(event){
        this.dependentValue = event.target.value;
        // send this to parent 
        let paramData = {
            controllerValue : this.controllerValue, 
            dependentValue : this.dependentValue,
            rowIndex:this.picklistRowId}
        ;
        let ev = new CustomEvent('selectedvalues', {
            detail : paramData
        });
        this.dispatchEvent(ev); 
    }
}
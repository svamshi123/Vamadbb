import { LightningElement,api,wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { refreshApex } from '@salesforce/apex';

import OBJECTA_OBJECT from '@salesforce/schema/ContentVersion';
import DOCUMENT_SUBCATAGORY from '@salesforce/schema/ContentVersion.Document_SubCategory__c'; 

export default class LightningComboBox extends LightningElement {
    @api comboLable;
    @api comboOptions;
    @api comboDataId;
    @api comboControlVal;
    @api comboDependentField;
    @api comboObjectInfo;
    dependentPickListValues;
    error;

    @wire(getObjectInfo, { objectApiName: OBJECTA_OBJECT })
    objectInfo;

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: DOCUMENT_SUBCATAGORY })
    dependentPickListValuesList({ data, error }) {
        if (data) {
            console.log('comboControlVal' + this.comboControlVal);
            this.dependentPickListValues = data;
            let key = this.dependentPickListValues.controllerValues[this.comboControlVal];
            this.comboOptions = this.dependentPickListValues.values.filter(opt => opt.validFor.includes(key));
            this.error = undefined;
        }
        if (error) {
            this.error = error;
            this.dependentPickListValues = undefined;
        }
    }

    handleComboOptions(event){
        const selectedEvent = new CustomEvent('selected', { detail: {
            selectedSubCategory:event.target.value, 
            rowId:this.comboDataId
        }});
        this.dispatchEvent(selectedEvent);
    }

    // @api fetchDependentPickListValues(controlVal,rowIndex){
    //     console.log('this 46 => ' +rowIndex);
    //     let key = this.dependentPickListValues.controllerValues[controlVal];
    //     console.log('this 48 => '+ key);
    //     if(this.template.querySelector(`[data-id="${rowIndex}"]`).options ){
    //         console.log('this 50');
    //         this.template.querySelector(`[data-id="${rowIndex}"]`).options = this.dependentPickListValues.values.filter(opt => opt.validFor.includes(key));
    //     }
    //     console.log('this 53');
        
    // }
}
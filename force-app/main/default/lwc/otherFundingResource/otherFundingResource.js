import { LightningElement,track , wire} from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';


import FUNDERS_OBJECT from '@salesforce/schema/Grant_Other_Funders__c';
import STATUS_FIELD from '@salesforce/schema/Grant_Other_Funders__c.Request_Status__c';
import SOURCE_FIELD from '@salesforce/schema/Grant_Other_Funders__c.Funding_Source__c';
import FROM_FIELD from '@salesforce/schema/Grant_Other_Funders__c.Funding_From__c';


export default class OtherFundingResource extends LightningElement {
    statusValues;
    sourceValues;
    totalSum = 0;
    fromOption;
    showRequired = false;
    isOtherFunderRequired = false;

    @track rows = [{
        Id: 0, 
        fundingSource:'', 
        fundingForm: '', 
        otherFunders:'',
        nameOftheProj: '', 
        amountAwarded: '', 
        statusOfRequest:'',
        startDateofFunding: '',
        disableOtherFunders : false
    }];



    @wire(getObjectInfo, { objectApiName: FUNDERS_OBJECT })
    objectInfo;

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: STATUS_FIELD })
    statusPicklistValues({ data, error }) {
       
        if (data) {
            this.statusValues = data.values;
            this.error = undefined;
        }
        if (error) {
            this.error = error;
            this.statusValues = undefined;
        }
    }

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: SOURCE_FIELD })
    sourcePicklistValues({ data, error }) {
        if (data) {
            this.sourceValues = data.values;
            this.error = undefined;
        }
        if (error) {
            this.error = error;
            this.sourceValues = undefined;
        }
    }

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: FROM_FIELD })
    fromPicklistValues({ data, error }) {
        if (data) {
            this.fromOption = data;
            this.error = undefined;
        }
        if (error) {
            this.error = error;
            this.fromOption = undefined;
        }
    }

    addRow() {
        let rowId = this.rows.length;
        this.rows.push({ Id: rowId,  fundingSource:'', fundingForm: '', otherFunders:'', nameOftheProj: '', amountAwarded: '', statusOfRequest:'',startDateofFunding: '', disableOtherFunders : false});
    }


    handleChange(event) {
        let fieldName = event.target.name;
        let fieldValue = event.target.value;
        let rowId = event.target.dataset.id;
        let rowIndex = this.rows.findIndex((row) => row.Id == rowId);
        this.rows[rowIndex][fieldName] = fieldValue;
        if(this.rows[rowIndex].fundingForm === 'Others'){
            this.rows[rowIndex].disableOtherFunders = true;
            this.isOtherFunderRequired = true;
        }else{
            this.rows[rowIndex].disableOtherFunders = false;
        }
        
        this.handleOtherSetValues(this.rows);
    }
    handleSourceChange(event){
        this.showRequired = true;
        let fieldName = event.target.name;
        let fieldValue = event.target.value;
        let rowId = event.target.dataset.id;
        let rowIndex = this.rows.findIndex((row) => row.Id == rowId);
        this.rows[rowIndex][fieldName] = fieldValue;
        let key = this.fromOption.controllerValues[fieldValue];
        this.funderFromOptions = this.fromOption.values.filter((row) => row.validFor.includes(key));

        this.handleOtherSetValues(this.rows);
       
    }
    handleAmountChange(event){
        let fieldName = event.target.name;
        let fieldValue = event.target.value;
        let rowId = event.target.dataset.id;
        let rowIndex = this.rows.findIndex((row) => row.Id == rowId);
        this.rows[rowIndex][fieldName] = fieldValue;
        this.totalSum = this.rows.reduce((acc,object) =>{
            return acc + (object.amountAwarded !== '' ? parseFloat(object.amountAwarded) : 0);
        },0)
        this.handleOtherSetValues(this.rows);
    }
   

    handleDelete(event) {
        let rowId = event.target.dataset.id;
        if(this.rows.length > 1){
            let rowIndex = this.rows.findIndex((row) => row.Id == rowId);
            let amount = this.rows[rowIndex].amountAwarded !== null ? this.rows[rowIndex].amountAwarded : 0;
            this.totalSum = parseFloat(this.totalSum) - amount;
            this.rows.splice(rowIndex, 1);
            this.handleOtherSetValues(this.rows);
        }
    }

    handleOtherSetValues(rowData) {
        this.dispatchEvent(new CustomEvent('otherfunding', { detail: rowData }));
    }
}
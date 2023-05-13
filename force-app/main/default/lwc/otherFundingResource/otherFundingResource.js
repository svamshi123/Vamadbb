import { LightningElement,track , wire,api} from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import FUNDERS_OBJECT from '@salesforce/schema/Grant_Other_Funders__c';
import STATUS_FIELD from '@salesforce/schema/Grant_Other_Funders__c.Request_Status__c';
import SOURCE_FIELD from '@salesforce/schema/Grant_Other_Funders__c.Funding_Source__c';
import FROM_FIELD from '@salesforce/schema/Grant_Other_Funders__c.Funding_From__c';

import createOtherFundingResource from '@salesforce/apex/OtherFundingResourceCtrl.createOtherFundingResource';
import getOtherFundingResouceRecords from '@salesforce/apex/OtherFundingResourceCtrl.getOtherFundingResouceRecords';
import deleteRow from '@salesforce/apex/OtherFundingResourceCtrl.deleteOFRRow';

const DELAY = 1000;
const PREVIEW = 'Preview';
const ERROR_MESSAGE = 'Error: Complete the Required fields from Funding Resource!!';
export default class OtherFundingResource extends LightningElement {
    statusValues;
    sourceValues;
    totalSum = 0;
    fromOption;
    showRequired = false;
    isOtherFunderRequired = false;
    funderFromOptions;
    otherFunderFromOptions;
    optionValues;
    @api parentRecord;
    @track rows = [];



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
            this.fromOption = data.values;
            this.error = undefined;
        }
        if (error) {
            this.error = error;
            this.fromOption = undefined;
        }
    }

    addRow() {
        let rowId = this.rows.length;
        this.rows.push({ Id: rowId,recId:'', fundingSource:'', fundingForm: '', otherFunders:'', nameOftheProj: '', amountAwarded: '', statusOfRequest:'',startDateofFunding: '', disableOtherFunders : false});
    }

    connectedCallback(){
        this.getOtherFundingReso();
        if(this.rows.length === 0){
            this.rows.push({
                Id: 0, 
                recId:'',
                rowIndex:'',
                fundingSource:'', 
                fundingForm: '', 
                otherFunders:'',
                nameOftheProj: '', 
                amountAwarded: 0.0, 
                statusOfRequest:'',
                startDateofFunding: '',
                disableOtherFunders : false,
                isOtherFunderForm : false
            });
        }
    }

    getOtherFundingReso(){
        getOtherFundingResouceRecords({appId:this.parentRecord}).then((data) =>{
            if(Array.isArray(data) && data.length > 0){
                this.rows = data;
                this.totalSum = this.rows.reduce((acc,object) =>{
                    return acc + (object.amountAwarded !== '' ? parseFloat(object.amountAwarded) : 0);
                },0)
                this.showRequired = true;
            }
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

    handleChange(event) {
        let fieldName = event.target.name;
        let fieldValue = event.target.value;
        let rowId = event.target.dataset.id;
        let rowIndex = this.rows.findIndex((row) => row.Id == rowId);
        this.rows[rowIndex]['rowIndex'] = rowIndex;
        this.rows[rowIndex][fieldName] = fieldValue;
        if(this.rows[rowIndex].fundingForm === 'Others'){
            this.rows[rowIndex].disableOtherFunders = true;
            this.isOtherFunderRequired = true;
        }else{
            this.rows[rowIndex].disableOtherFunders = false;
            this.rows[rowIndex].otherFunders = '';
        }
        
        this.handleOtherSetValues(this.rows,rowIndex);
    }
    handleSourceChange(event){
        this.showRequired = true;
        let fieldName = event.target.name;
        let fieldValue = event.target.value;
        let rowId = event.target.dataset.id;
        let rowIndex = this.rows.findIndex((row) => row.Id == rowId);
        this.rows[rowIndex]['rowIndex'] = rowIndex;
        this.rows[rowIndex][fieldName] = fieldValue;
       
        if(fieldValue === 'None'){
            if(this.rows.length === 1){
                this.showRequired = false;
            }
            this.rows[rowIndex]['fundingForm'] = '';
            this.rows[rowIndex]['otherFunders'] = '';
            this.rows[rowIndex]['nameOftheProj'] = '';
            this.rows[rowIndex]['amountAwarded'] = parseFloat('0.00');
            this.rows[rowIndex]['statusOfRequest'] = '';
            this.rows[rowIndex]['startDateofFunding'] = '';
        }
        this.handleOtherSetValues(this.rows,rowIndex);
       
    }
    handleAmountChange(event){
        let fieldName = event.target.name;
        let fieldValue = event.target.value;
        let rowId = event.target.dataset.id;
        let rowIndex = this.rows.findIndex((row) => row.Id == rowId);
        this.rows[rowIndex]['rowIndex'] = rowIndex;
        this.rows[rowIndex][fieldName] = fieldValue;
        this.totalSum = this.rows.reduce((acc,object) =>{
            return acc + (object.amountAwarded !== '' ? parseFloat(object.amountAwarded) : 0);
        },0)
        this.handleOtherSetValues(this.rows,rowIndex);
    }
   

    handleDelete(event) {
        let rowId = event.target.dataset.id;
        if(this.rows.length > 1){
            let rowIndex = this.rows.findIndex((row) => row.Id == rowId);
            let amount = this.rows[rowIndex].amountAwarded !== null ? this.rows[rowIndex].amountAwarded : 0;
            this.totalSum = parseFloat(this.totalSum) - amount;
            let checkBlank = this.rows[rowIndex].recId;
            if(checkBlank.trim() !== ''){
                this.deleteRecord(this.rows[rowIndex].recId);
            }
            this.rows.splice(rowIndex, 1);
        }
    }

   async handleOtherSetValues(rowData,rowIndex) {
        window.clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => {
            this.updateRecords(rowData,rowIndex);
        },DELAY);
    }
    async updateRecords(rowData,rowIndex){
        await this.upsertGrandFundersRecord(rowData,rowIndex);
    }

    upsertGrandFundersRecord(rowData,rowIndex){
        createOtherFundingResource({resourceData:JSON.stringify(rowData),parRecId:this.parentRecord,rowIndex:rowIndex}).then((data) =>{
            if(data != null){
                this.rows[rowIndex]['recId'] = data[rowIndex];
            }
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

    deleteRecord(recId){
        deleteRow({recId:recId,parId:this.parentRecord}).then((data) =>{
            this.getOtherFundingReso();
        }).catch((error) =>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }

    @api 
    validateData(){
        let checkEmptyVal = [];
        this.rows.forEach(e =>{
            if((e.nameOftheProj === '' || e.nameOftheProj === null || e.nameOftheProj === undefined) ||
               (e.fundingForm === '' || e.fundingForm === null || e.fundingForm === undefined) ||
                (e.amountAwarded === '' || e.amountAwarded === null || e.amountAwarded === '0.00' || e.amountAwarded === undefined) || 
                (e.statusOfRequest === '' || e.statusOfRequest === null || e.statusOfRequest === undefined) ||
                (e.startDateofFunding === '' || e.startDateofFunding === null || e.startDateofFunding === undefined)){
                    if(e.fundingSource === 'None'){
                        return ;
                    }
                checkEmptyVal.push(PREVIEW);
            }
        });
        if(checkEmptyVal.includes(PREVIEW)) {
            const event1 = new ShowToastEvent({
                title: 'Error!',
                message: ERROR_MESSAGE,
                variant: 'error'
            });
            this.dispatchEvent(event1);
            return true;
        }
        return false;
    }
}
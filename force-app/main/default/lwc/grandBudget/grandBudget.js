import { LightningElement,api,track,wire } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation'; 
import { fireEvent } from 'c/pubSub'; 

import APPLICATION_ID from '@salesforce/schema/Application__c.Id';
import TOTAL_DIRECT_ACTUAL from '@salesforce/schema/Application__c.Project_Total_Direct_Actual__c';
import TOTAL_DIRECT_EXPEMSES  from '@salesforce/schema/Application__c.Project_Total_Direct_Expenses__c';
import TOTAL_DIRECT_OTHER_FUND from '@salesforce/schema/Application__c.Project_Total_Direct_Other_Fund_Source__c';
import TOTAL_DIRECT_REQUESTED from '@salesforce/schema/Application__c.Project_Total_Direct_Requested__c';

import TOTAL_ADMIN_ACTUAL from '@salesforce/schema/Application__c.Project_Total_Administrative_Actual__c';
import TOTAL_ADMIN_EXPENSES from '@salesforce/schema/Application__c.Project_Total_Administrative_Expenses__c';
import TOTAL_ADMIN_OTHER_FUND from '@salesforce/schema/Application__c.Project_Total_Administrative_Other_Fund__c';
import TOTAL_ADMIN_REQUESTED from '@salesforce/schema/Application__c.Project_Total_Administrative_Requested__c';

import TOTAL_PERSONNEL_ACTUAL from '@salesforce/schema/Application__c.Project_Total_Personnel_Actual__c';
import TOTAL_PERSONNEL_EXPENSES from '@salesforce/schema/Application__c.Project_Total_Personnel_Expenses__c';
import TOTAL_PERSONNEL_OTHER_FUND from '@salesforce/schema/Application__c.Project_Total_Personnel_Other_Fund_Sourc__c';
import TOTAL_PERSONNEL_REQUESTED from '@salesforce/schema/Application__c.Project_Total_Personnel_Requested__c';


import upsertData from '@salesforce/apex/OtherFundingResourceCtrl.getDataUpsert';
import getAllBudgets from '@salesforce/apex/OtherFundingResourceCtrl.getAllBudgets';
import deleteRow from '@salesforce/apex/OtherFundingResourceCtrl.deleteRow';

const DIRECT_EXPENSES = 'Other Direct Expenses';
const ADMIN_EXPENSES = 'Administrative Expenses';
const PERSONAL_EXPENSES = 'Direct - Project Personnel Expenses';
const PREVIEW = 'Preview';
const ERROR_MESSAGE = 'The required fields must be completed and values should not be 0';
const DELAY = 1000;
export default class GrandBudget extends LightningElement {
    @api colValue;
    @api columnData;
    @api rowId;
    totalcolBudget = 0;
    totalcolotherFundingSources = 0;
    totalcolrequestedFromSentara = 0;
    totalcolactualGrantExpenses = 0;
    totalcoldiff = 0;
    totalcolpercentage = 0;
    finalRowdata = [];
    @api parentRecord;
    @api totalName;
    @track rows = [];
    isRowAdded = false;

    @wire(CurrentPageReference) pageRef; 

    connectedCallback(){
        this.getGrandBudgets();

        if(this.rows.length === 0){
            this.rows.push({
                Id: 0, 
                recId:'',
                rowIndex:'',
                colexpenseCategory:'',
                expenseCategory:'',
                totalBudget:'',
                otherFundingSources:0.00,
                requestedFromSentara:'',
                actualGrantExpenses:0.00,
                diff:'',
                percentage:'',
                totalcolBudget:0,
                totalcolotherFundingSources:0,
                totalcolrequestedFromSentara:0,
                totalcolactualGrantExpenses:0,
                totalcoldiff:0,
                totalcolpercentage:0
            });
        }
    }

    addRow() {
        let rowId = this.rows.length;
        this.rows.push({ Id: rowId, recId:'', colexpenseCategory:'', expenseCategory:'', totalBudget: '', otherFundingSources:'', requestedFromSentara:'', actualGrantExpenses: '', diff: '', percentage:''});
        this.isRowAdded = true;
    }

    async handleChange(event) {
        let fieldName = event.target.name;
        let fieldValue = event.target.value;
        const inputElement = event.target;
        let rowId = event.target.dataset.id;
        let rowIndex = this.rows.findIndex((row) => row.Id == rowId);
        this.rows[rowIndex]['rowIndex'] = rowIndex;
        this.rows[rowIndex][fieldName] = fieldValue;
         this.rows[rowIndex]['colexpenseCategory'] = this.colValue,
        this.rows[rowIndex]['diff'] =  this.rows[rowIndex]['totalBudget'] > 0 ? parseFloat(this.rows[rowIndex]['totalBudget'] !== '' ? this.rows[rowIndex]['totalBudget']:0) - parseFloat(this.rows[rowIndex]['requestedFromSentara']!== ''?this.rows[rowIndex]['requestedFromSentara']:0):
        parseFloat(this.rows[rowIndex]['totalBudget']!== ''?this.rows[rowIndex]['totalBudget']:0);
        this.rows[rowIndex]['percentage'] =  (parseFloat(this.rows[rowIndex]['requestedFromSentara'] !== '' ? this.rows[rowIndex]['requestedFromSentara']:0) / parseFloat(this.rows[rowIndex]['totalBudget']!== ''?this.rows[rowIndex]['totalBudget']:0)) * 100;

        this.totalcolBudget = this.rows.reduce((acc,object) =>{
            return acc + (object.totalBudget !== '' ? parseFloat(object.totalBudget) : 0);
        },0)

        if(this.totalcolBudget !== null && this.totalcolBudget !== undefined){
            this.rows[rowIndex]['totalcolBudget'] = this.totalcolBudget;
        }

        this.totalcolotherFundingSources = this.rows.reduce((acc,object) =>{
            return acc + (object.otherFundingSources !== '' ? parseFloat(object.otherFundingSources) : 0);
        },0)

        if(this.totalcolotherFundingSources !== null && this.totalcolotherFundingSources !== undefined){
            this.rows[rowIndex]['totalcolotherFundingSources'] = this.totalcolotherFundingSources;
        }
        
        this.totalcolrequestedFromSentara = this.rows.reduce((acc,object) =>{
            return acc + (object.requestedFromSentara !== '' ? parseFloat(object.requestedFromSentara) : 0);
        },0)

        if(this.totalcolrequestedFromSentara !== null && this.totalcolrequestedFromSentara !== undefined){
            this.rows[rowIndex]['totalcolrequestedFromSentara'] = this.totalcolrequestedFromSentara;
        }
        
        this.totalcolactualGrantExpenses = this.rows.reduce((acc,object) =>{
            return acc + (object.actualGrantExpenses !== '' ? parseFloat(object.actualGrantExpenses) : 0);
        },0)

        if(this.totalcolactualGrantExpenses !== null && this.totalcolactualGrantExpenses !== undefined){
            this.rows[rowIndex]['totalcolactualGrantExpenses'] = this.totalcolactualGrantExpenses;
        }
        
        this.totalcoldiff = this.rows.reduce((acc,object) =>{
            return acc + (object.diff !== '' ? parseFloat(object.diff) : 0);
        },0)
        if(this.totalcoldiff !== null && this.totalcoldiff !== undefined){
            this.rows[rowIndex]['totalcoldiff'] = this.totalcoldiff;
        }
        
        this.totalcolpercentage = this.rows.reduce((acc,object) =>{
            return acc + (object.percentage !== '' ? parseFloat(object.percentage) : 0);
        },0)

        if(this.totalcolpercentage !== null && this.totalcolpercentage !== undefined){
            this.rows[rowIndex]['totalcolpercentage'] = this.totalcolpercentage;
        }
        if(this.colValue === DIRECT_EXPENSES) {
            this.handleDirectEcpenses();
        }else  if(this.colValue === ADMIN_EXPENSES) {
            this.handleAdminEcpenses();
        }else  if(this.colValue === PERSONAL_EXPENSES) {
            this.handlePersonlaEcpenses();
        }
        window.clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => {
            this.updateRecord(this.rows,rowIndex,inputElement);
        },DELAY);
    }
    async updateRecord(rowData,rowIndex,inputElement){
        let retVal = await this.checkValidation(inputElement);
        if(retVal === false){
            await this.upsertGrandBudgetRecord(rowData,rowIndex);
        }
    }
    upsertGrandBudgetRecord(rowData,rowIndex){
        upsertData({recData:JSON.stringify(rowData),parRecId:this.parentRecord,rowIndex:rowIndex}).then((data) => {
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

    checkValidation(inputElement){
        if((inputElement.name === 'totalBudget' && (inputElement.value === '' || inputElement.value === '0' || inputElement.value === null)) ||
           (inputElement.name === 'requestedFromSentara' && (inputElement.value === '' || inputElement.value === '0' || inputElement.value === null))){
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error record',
                    message: ERROR_MESSAGE,
                    variant: 'error'
                })
            );
            inputElement.classList.add('required');
            return true;
        }
        inputElement.classList.remove('required');
        return false;
    }

    getGrandBudgets(){
        getAllBudgets({appId: this.parentRecord,expenseCategory:this.colValue}).then((data) =>{
            let returnData = JSON.parse(data);
            if(Array.isArray(returnData.objWrapList) && returnData.objWrapList.length > 0){
                this.rows = returnData.objWrapList;
                if(this.colValue === DIRECT_EXPENSES) {
                    this.getTotalCalculate(returnData.objWrapList);
                }else  if(this.colValue === ADMIN_EXPENSES) {
                    this.getTotalCalculate(returnData.objWrapList);
                }else  if(this.colValue === PERSONAL_EXPENSES) {
                    this.getTotalCalculate(returnData.objWrapList);
                }
            }
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
    getTotalCalculate(rowData){
        this.totalcolBudget = rowData.reduce((acc,object) =>{
            return acc + (object.totalBudget !== '' ? parseFloat(object.totalBudget) : 0);
        },0)

        this.totalcolotherFundingSources = rowData.reduce((acc,object) =>{
            return acc + (object.otherFundingSources !== '' ? parseFloat(object.otherFundingSources) : 0);
        },0)

        this.totalcolrequestedFromSentara = rowData.reduce((acc,object) =>{
            return acc + (object.requestedFromSentara !== '' ? parseFloat(object.requestedFromSentara) : 0);
        },0)

        this.totalcolactualGrantExpenses = rowData.reduce((acc,object) =>{
            return acc + (object.actualGrantExpenses !== '' ? parseFloat(object.actualGrantExpenses) : 0);
        },0)

        this.totalcoldiff = rowData.reduce((acc,object) =>{
            return acc + (object.diff !== '' ? parseFloat(object.diff) : 0);
        },0)

        this.totalcolpercentage = rowData.reduce((acc,object) =>{
            return acc + (object.percentage !== '' ? parseFloat(object.percentage) : 0);
        },0)
        if(this.colValue === DIRECT_EXPENSES) {
            this.handleDirectEcpenses();
        }else  if(this.colValue === ADMIN_EXPENSES) {
            this.handleAdminEcpenses();
        }else  if(this.colValue === PERSONAL_EXPENSES) {
            this.handlePersonlaEcpenses();
        }
    }
    handleDelete(event) {
        let rowId = event.target.dataset.id;
        try{       
            if(this.rows.length > 1){
                let rowIndex = this.rows.findIndex((row) => row.Id == rowId);
                //Total Budget
                let colBudget = this.rows[rowIndex].totalBudget !== null ? this.rows[rowIndex].totalBudget : 0;
                this.totalcolBudget = parseFloat(this.totalcolBudget) - colBudget;
                //Other Funding Source
                let colOtherFundingSource = this.rows[rowIndex].otherFundingSources !== null ? this.rows[rowIndex].otherFundingSources : 0;
                this.totalcolotherFundingSources = parseFloat(this.totalcolotherFundingSources) - colOtherFundingSource;
                // Request From Santara
                let colRequestFromSantara = this.rows[rowIndex].requestedFromSentara !== null ? this.rows[rowIndex].requestedFromSentara : 0;
                this.totalcolrequestedFromSentara = parseFloat(this.totalcolrequestedFromSentara) - colRequestFromSantara;
                //Actual Grant Expenses
                let colactualGrantExpenses = this.rows[rowIndex].actualGrantExpenses !== null ? this.rows[rowIndex].actualGrantExpenses : 0;
                this.totalcolactualGrantExpenses = parseFloat(this.totalcolactualGrantExpenses) - colactualGrantExpenses;
                //Diff of Other Funding Source from Total Budget
                let coldiff = this.rows[rowIndex].diff !== null ? this.rows[rowIndex].diff : 0;
                this.totalcoldiff = parseFloat(this.totalcoldiff) - coldiff;
                //Percentage of Other Funding Source from Total Budget
                let colpercentage = this.rows[rowIndex].percentage !== null ? this.rows[rowIndex].percentage : 0;
                this.totalcolpercentage = parseFloat(this.totalcolpercentage) - colpercentage;
                let checkBlank = this.rows[rowIndex].recId;
               
                if(checkBlank.trim() !== ''){
                    const fields = {};
                    fields[APPLICATION_ID.fieldApiName] = this.parentRecord;
                    if(this.colValue === DIRECT_EXPENSES) {
                        fields[TOTAL_DIRECT_EXPEMSES.fieldApiName] = this.totalcolBudget;
                        fields[TOTAL_DIRECT_REQUESTED.fieldApiName] = this.addEventListenertotalcolrequestedFromSentara;
                        fields[TOTAL_DIRECT_OTHER_FUND.fieldApiName] = this.totalcolotherFundingSources;
                        fields[TOTAL_DIRECT_ACTUAL.fieldApiName] = this.totalcolactualGrantExpenses;
                    }else  if(this.colValue === ADMIN_EXPENSES) {
                        fields[TOTAL_ADMIN_EXPENSES.fieldApiName] =  this.totalcolBudget;
                        fields[TOTAL_ADMIN_REQUESTED.fieldApiName] =  this.totalcolrequestedFromSentara;
                        fields[TOTAL_ADMIN_OTHER_FUND.fieldApiName] =  this.totalcolotherFundingSources;
                        fields[TOTAL_ADMIN_ACTUAL.fieldApiName] =  this.totalcolactualGrantExpenses;
                    }else  if(this.colValue === PERSONAL_EXPENSES) {
                        fields[TOTAL_PERSONNEL_EXPENSES.fieldApiName] =  this.totalcolBudget;
                        fields[TOTAL_PERSONNEL_REQUESTED.fieldApiName] =  this.totalcolrequestedFromSentara;
                        fields[TOTAL_PERSONNEL_OTHER_FUND.fieldApiName] =  this.totalcolotherFundingSources;
                        fields[TOTAL_PERSONNEL_ACTUAL.fieldApiName] =  this.totalcolactualGrantExpenses;
                    }
                    this.deleteRecord(this.rows[rowIndex].recId,fields,rowIndex)
                }
                this.rows.splice(rowIndex, 1);
            }else {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: 'You can not delete if it have sigle row. Please update the values',
                        variant: 'info'
                    })
                );
            }
        }catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error deleting record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        }
    }

    deleteRecord(recId,fields,rowIndex){
        deleteRow({recId:recId,parId:this.parentRecord,colValue:this.colValue}).then((data) =>{
            this.updateApplication(fields);
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }

    updateApplication(fields){
        const recordInput = { fields };
        updateRecord(recordInput).then(() => {
           this.getGrandBudgets();
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }

    @api 
    validateData(){
        let checkEmptyVal = [];
        if(this.colValue === DIRECT_EXPENSES) {
            let totalObject = {
                totalcolBudget: this.totalcolBudget,
                totalcolotherFundingSources : this.totalcolotherFundingSources,
                totalcolrequestedFromSentara : this.totalcolrequestedFromSentara,
                totalcolactualGrantExpenses : this.totalcolactualGrantExpenses,
                totalcoldiff : this.totalcoldiff,
                totalcolpercentage : this.totalcolpercentage
            }
            this.rows.forEach(e =>{
                if(e.totalBudget === '' || e.totalBudget === null || e.totalBudget === '0.00' ||
                 e.requestedFromSentara === '' || e.requestedFromSentara === null || e.requestedFromSentara === '0.00'){
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
                return {};
            }
            return totalObject;

        }else if(this.colValue === ADMIN_EXPENSES) {
            let totalObject = {
                totalcolBudget: this.totalcolBudget,
                totalcolotherFundingSources : this.totalcolotherFundingSources,
                totalcolrequestedFromSentara : this.totalcolrequestedFromSentara,
                totalcolactualGrantExpenses : this.totalcolactualGrantExpenses,
                totalcoldiff : this.totalcoldiff,
                totalcolpercentage : this.totalcolpercentage
            }
            this.rows.forEach(e =>{
                if(e.totalBudget === '' || e.totalBudget === null || e.totalBudget === '0.00' ||
                e.requestedFromSentara === '' || e.requestedFromSentara === null || e.requestedFromSentara === '0.00'){
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
                return {};
            }
            return totalObject;

        }else if(this.colValue === PERSONAL_EXPENSES) {
            let totalObject = {
                totalcolBudget: this.totalcolBudget,
                totalcolotherFundingSources : this.totalcolotherFundingSources,
                totalcolrequestedFromSentara : this.totalcolrequestedFromSentara,
                totalcolactualGrantExpenses : this.totalcolactualGrantExpenses,
                totalcoldiff : this.totalcoldiff,
                totalcolpercentage : this.totalcolpercentage
            }
            this.rows.forEach(e =>{
                if(e.totalBudget === '' || e.totalBudget === null || e.totalBudget === '0.00' ||
                e.requestedFromSentara === '' || e.requestedFromSentara === null || e.requestedFromSentara === '0.00'){
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
                return {};
            }
            return totalObject;
        }
    }
    handleDirectEcpenses(){
        let totalObject = [{
            arrayObjectName: 'direct',
            totalcolBudget: this.totalcolBudget,
            totalcolotherFundingSources : this.totalcolotherFundingSources,
            totalcolrequestedFromSentara : this.totalcolrequestedFromSentara,
            totalcolactualGrantExpenses : this.totalcolactualGrantExpenses,
            totalcoldiff : this.totalcoldiff,
            totalcolpercentage : this.totalcolpercentage
        }];
       fireEvent(this.pageRef, "directExpenses", totalObject); 
    }
    handleAdminEcpenses(){
        let totalObject = [{
            arrayObjectName: 'admin',
            totalcolBudget: this.totalcolBudget,
            totalcolotherFundingSources : this.totalcolotherFundingSources,
            totalcolrequestedFromSentara : this.totalcolrequestedFromSentara,
            totalcolactualGrantExpenses : this.totalcolactualGrantExpenses,
            totalcoldiff : this.totalcoldiff,
            totalcolpercentage : this.totalcolpercentage
        }];
       fireEvent(this.pageRef, "adminExpenses", totalObject); 
    }
    handlePersonlaEcpenses(){
        let totalObject = [{
            arrayObjectName: 'personal',
            totalcolBudget: this.totalcolBudget,
            totalcolotherFundingSources : this.totalcolotherFundingSources,
            totalcolrequestedFromSentara : this.totalcolrequestedFromSentara,
            totalcolactualGrantExpenses : this.totalcolactualGrantExpenses,
            totalcoldiff : this.totalcoldiff,
            totalcolpercentage : this.totalcolpercentage
        }]
       fireEvent(this.pageRef, "personalExpenses", totalObject); 
    }
    
}
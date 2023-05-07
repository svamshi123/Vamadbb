import { LightningElement, wire,api ,track} from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { FlowNavigationFinishEvent} from 'lightning/flowSupport';


import GRANT_OBJECT from '@salesforce/schema/Grant_Budget__c';
import updateStatusForGBAndOGB from '@salesforce/apex/OtherFundingResourceCtrl.updateStatusForGBAndOGB';
const DIRECT_EXPENSES = 'Other Direct Expenses';
const ADMIN_EXPENSES = 'Administrative Expenses';
const PERSONAL_EXPENSES = 'Direct - Project Personnel Expenses';


export default class ParentCmp extends LightningElement {
    expenseCategory;
    error;
    directExpenses = [];
    adminExpenses = [];
    personalExpenses = [];
    otherFunding = [];
    directMap = {};
    adminMap = {};
    personalMap = {};
    @api parentRecord = 'a0D2y000002zInzEAE';
    totalAllColBudget = 0;
    totalAllColotherFundingSources = 0;
    totalAllColrequestedFromSentara = 0;
    totalAllColactualGrantExpenses = 0;
    totalAllColdiff = 0;
    totalAllColpercentage = 0;
    submitDisabled = true;
   
    column = [
        {label: '<span style="color: red; ">*</span> Total Budget',fieldName:'Total Budget'},
        {label: '<span style="color: red; ">*</span> Requested from Sentara',fieldName:'Requested from Sentara'},
        {label: 'Other Funding Sources',fieldName:'Other Funding Sources'},
        {label: 'Actual Grant Expenses',fieldName:'Actual Grant Expenses'},
        {label: 'Var $',fieldName:'Var $'},
        {label: 'Var %',fieldName:'Var %'},
        // {label: ' ',fieldName:' '}
    ];

    @wire(getObjectInfo, { objectApiName: GRANT_OBJECT })
    objectInfo;

    get otherDirectExpenses(){
        return DIRECT_EXPENSES;
    }

    get administrativeExpenses(){
        return ADMIN_EXPENSES;
    }
    
    get personnelExpenses(){
        return PERSONAL_EXPENSES;
    }

   async createGrantBudget(){
        let personnelExpensesValidate =   await this.template.querySelector('.personnelExpenses').validateData();
        // console.log('personnelExpensesValidate --> '+personnelExpensesValidate);
        let otherDirectExpensesValidate =   await this.template.querySelector('.otherDirectExpenses').validateData();
        // console.log('otherDirectExpensesValidate --> '+otherDirectExpensesValidate);
        let administrativeExpensesValidate =   await this.template.querySelector('.administrativeExpenses').validateData();
        // console.log('administrativeExpenses --> '+administrativeExpensesValidate);
        if(personnelExpensesValidate === false && otherDirectExpensesValidate === false && administrativeExpensesValidate === false){
            updateStatusForGBAndOGB({parRecId:this.parentRecord}).then((data) =>{
                if(data !== '' && data !== null && data.length > 0){
                    //this.closeFlow();
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success!',
                            message: 'Application is created succesfully and email has been sent ',
                            variant: 'success',
                        }),
                    );
                }
            }).catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error!',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
        }
    }

    closeFlow(){
        const closeAction = { type: "FLOW_FINISH" };
        const closeFlowEvent = new FlowNavigationFinishEvent(closeAction);
        this.dispatchEvent(closeFlowEvent);
    }
    
    handleOtherFunding(event){
        this.otherFunding = event.detail;
    }
    handleCheckboxclick(event){
        this.submitDisabled = !event.detail.checked;
    }
}
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

    @api parentRecord = 'a0D2y000002zInzEAE';
    isPreviewModalOpen = false;
    totalPersonalExpenses = true;
    totalAdminExpenses = true;
    totalDirectExpenses = true;
    submitDisabled = true;
   
    column = [
        {label: '<span style="color: red; ">*</span> Total Budget',fieldName:'Total Budget'},
        {label: '<span style="color: red; ">*</span> Requested from Sentara',fieldName:'Requested from Sentara'},
        {label: 'Other Funding Sources',fieldName:'Other Funding Sources'},
        {label: 'Actual Grant Expenses',fieldName:'Actual Grant Expenses'},
        {label: 'Var $',fieldName:'Var $'},
        {label: 'Var %',fieldName:'Var %'}
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
        let otherDirectExpensesValidate =   await this.template.querySelector('.otherDirectExpenses').validateData();
        let administrativeExpensesValidate =   await this.template.querySelector('.administrativeExpenses').validateData();
        let otherFunderSourceValidate =   await this.template.querySelector('.otherFunderSource').validateData();
        let totalBudgetColumn =  await this.template.querySelector('.totalBudgetColumn').gettotalValues();
        let finalObject = {
            totalPersonnelExpenses : personnelExpensesValidate,
            totalotherDirectExpenses : otherDirectExpensesValidate,
            totaladministrativeExpenses : administrativeExpensesValidate,
            totalCalBudget : totalBudgetColumn
        }
        if((Object.keys(personnelExpensesValidate).length !== 0 && Object.keys(otherDirectExpensesValidate).length !== 0  && Object.keys(administrativeExpensesValidate).length !== 0) 
           && (otherFunderSourceValidate === false)){
            updateStatusForGBAndOGB({parRecId:this.parentRecord, fundingResourceCheck: otherFunderSourceValidate,totalValues: finalObject}).then((data) =>{
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
    
    handleCheckboxclick(event){
        this.submitDisabled = !event.detail.checked;
    }
    handlePreView(){
        this.isPreviewModalOpen = true
    }
    handleModalClose(event){
        this.isPreviewModalOpen = !event.detail.isModalOpen
    }
}
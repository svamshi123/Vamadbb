import { LightningElement, wire,api ,track} from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { FlowNavigationFinishEvent } from 'lightning/flowSupport';


import GRANT_OBJECT from '@salesforce/schema/Grant_Budget__c';
import createGrnatBudgetRecords from '@salesforce/apex/OtherFundingResourceCtrl.createGrnatBudgetRecords';

const DIRECT_EXPENSES = 'Other Direct Expenses';
const ADMIN_EXPENSES = 'Administrative Expenses'; //'Administrative Expenses (not to exceed 15% of grant request)';
const PERSONAL_EXPENSES = 'Direct - Project Personnel Expenses';
const PREVIEW = 'Preview';
const ERROR_MESSAGE = 'The required fields must be completed.';

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

   
    createGrantBudget(){
        let finalList = [...this.directExpenses,...this.adminExpenses,...this.personalExpenses];
        console.log('finalList *** '+JSON.stringify(finalList));
        console.log('otherFunding ### ' + JSON.stringify(this.otherFunding));
        let checkEmptyVal = [];
        let othercheckEmptyVal = [];
        finalList.forEach(e =>{
            if(e.totalBudget === '' || e.totalBudget === null || e.requestedFromSentara === '' || e.requestedFromSentara === null){
                checkEmptyVal.push(PREVIEW);
            }
        });
        this.otherFunding.forEach(e =>{
            if(e.fundingSource !== null && e.fundingSource !== 'None' && e.fundingSource !== undefined){
                if(e.fundingForm === '' || e.nameOftheProj === '' || e.amountAwarded === '' || e.statusOfRequest === '' || e.startDateofFunding === '' ||
                e.fundingForm === null || e.nameOftheProj === null || e.amountAwarded === null || e.statusOfRequest === null || e.startDateofFunding === null){
                    othercheckEmptyVal.push(true)
                }
            }
        })
        if(checkEmptyVal.includes(PREVIEW) || othercheckEmptyVal.includes(true)) {
            const event1 = new ShowToastEvent({
                title: 'Error!',
                message: ERROR_MESSAGE,
                variant: 'error'
            });
            this.dispatchEvent(event1);
            return false;
        }else{
            createGrnatBudgetRecords({resourceData:JSON.stringify(finalList),parRecId: this.parentRecord,directMap: this.directMap,
                adminMap:this.adminMap,personalMap:this.personalMap,otherFundingSrc:JSON.stringify(this.otherFunding)}).then((data) => {
                console.log({data});
                if(data !== '' && data !== null && data.length > 0){
                    this.closeFlow();
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: `Successfuly ${parseInt(finalList.length) + parseInt(this.otherFunding.length)} records were created `,
                            variant: 'success',
                        }),
                    );
                }
            }).catch((error) =>{
                console.log({error});
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            })
        }
    }

    closeFlow(){
        const closeAction = { type: "FLOW_FINISH" };
        const closeFlowEvent = new FlowNavigationFinishEvent(closeAction);
        this.dispatchEvent(closeFlowEvent);
    }
    
    handleOtherEvent(event){
        this.directExpenses = event.detail;
        let getlastIndex = this.directExpenses.length - 1;
        const lastObj = this.directExpenses[getlastIndex];
        this.directMap['colexpenseCategory'] = lastObj.colexpenseCategory;
        this.directMap['totalcolBudget'] = lastObj.totalcolBudget;
        this.directMap['totalcolotherFundingSources'] = lastObj.totalcolotherFundingSources;
        this.directMap['totalcolrequestedFromSentara'] = lastObj.totalcolrequestedFromSentara;
        this.directMap['totalcolactualGrantExpenses'] = lastObj.totalcolactualGrantExpenses;
        this.directMap['totalcoldiff'] = lastObj.totalcoldiff;
        this.directMap['totalcolpercentage'] = lastObj.totalcolpercentage;

    }
    handleAdminEvent(event){
        this.adminExpenses = event.detail;
        let getlastIndex = this.adminExpenses.length - 1;
        const lastObj = this.adminExpenses[getlastIndex];
        this.adminMap['colexpenseCategory'] = lastObj.colexpenseCategory;
        this.adminMap['totalcolBudget'] = lastObj.totalcolBudget;
        this.adminMap['totalcolotherFundingSources'] = lastObj.totalcolotherFundingSources;
        this.adminMap['totalcolrequestedFromSentara'] = lastObj.totalcolrequestedFromSentara;
        this.adminMap['totalcolactualGrantExpenses'] = lastObj.totalcolactualGrantExpenses;
        this.adminMap['totalcoldiff'] = lastObj.totalcoldiff;
        this.adminMap['totalcolpercentage'] = lastObj.totalcolpercentage;
    }
    handlePersonalEvent(event){
        this.personalExpenses = event.detail;
        let getlastIndex = this.personalExpenses.length - 1;
        const lastObj = this.personalExpenses[getlastIndex];
        this.personalMap['colexpenseCategory'] = lastObj.colexpenseCategory;
        this.personalMap['totalcolBudget'] = lastObj.totalcolBudget;
        this.personalMap['totalcolotherFundingSources'] = lastObj.totalcolotherFundingSources;
        this.personalMap['totalcolrequestedFromSentara'] = lastObj.totalcolrequestedFromSentara;
        this.personalMap['totalcolactualGrantExpenses'] = lastObj.totalcolactualGrantExpenses;
        this.personalMap['totalcoldiff'] = lastObj.totalcoldiff;
        this.personalMap['totalcolpercentage'] = lastObj.totalcolpercentage;  
    }
    handleOtherFunding(event){
        this.otherFunding = event.detail;
    }
    handleCheckboxclick(event){
        this.submitDisabled = !event.detail.checked;
    }
}
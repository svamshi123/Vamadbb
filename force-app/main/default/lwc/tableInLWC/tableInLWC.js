import { LightningElement, track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


import SAVE_RES from '@salesforce/schema/SaveRes__c';
import TABLE_DATE from '@salesforce/schema/SaveRes__c.TableDate__c';
import USER_EMAIL from '@salesforce/schema/SaveRes__c.UserEmail__c';

export default class TableInLWC extends LightningElement {
    @track firstNumber;
    @track secondNumber;
    userEmail;
    resultValue = '';
    handleNumberOeChange(event) {
        this.firstNumber = event.target.value;
    }
    handleNumberTwoChange(event) {
        this.secondNumber = event.target.value;
    }

    multiplication() {
        for (var i = 1; i <= parseInt(this.secondNumber); i++) {
            this.resultValue += `${this.firstNumber} * ${i} = ${this.firstNumber*i}` + '\n';
        }
    }
    handleEmailChange(event) {
        this.userEmail = event.target.value;
    }
    handleClick() {
        console.log(this.resultValue);
        console.log(this.userEmail);
        const fields = {};
        fields[TABLE_DATE.fieldApiName] = this.resultValue;
        fields[USER_EMAIL.fieldApiName] = this.userEmail;
        const recordInput = { apiName: SAVE_RES.objectApiName, fields };
        createRecord(recordInput).then(res => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Student created ' + res.Id,
                    variant: 'success',
                }),
            );
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating Student',
                    message: error.body.message,
                    variant: 'error',
                }),
            );
        });
    }
}
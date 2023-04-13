import { LightningElement, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import hasPermissions from "@salesforce/userPermission/Principal";
import getObjectAccess from '@salesforce/apex/Permissionsetclass.getObjectAccess';
import cusLabel from './CustomLabel';

import STUDENT_OBJECT from '@salesforce/schema/Student__c';
import GRADUATION_FIELD from '@salesforce/schema/Student__c.Graduation__c';
import POST_GRADUATION_FIELD from '@salesforce/schema/Student__c.Post_Graduation__c';
import PRINCIPAL_LOOKUP from '@salesforce/schema/Student__c.Principal__c';
import STUDENT_NAME from '@salesforce/schema/Student__c.Name';
import STUDENT_ROLL_NUMBER from '@salesforce/schema/Student__c.Roll_Number__c';

export default class StudentForm extends LightningElement {
    customobjectApiName = STUDENT_OBJECT;
    lookUpFiled = PRINCIPAL_LOOKUP;
    GpickListvalues;
    PGpickListvalues;
    FieldData;
    GraduationValue;
    PGraduationValue;
    LookupValue;
    temp;
    StudentName;
    SturollNumber;
    fieldaccess;
    disableinput = true;
    isModalOpen = false;
    customLabels;


    connectedCallback() {
        this.customLabels = cusLabel;
        console.log(cusLabel.label.Enter_Student_Name);
        getObjectAccess().then(data => {
            this.fieldaccess = data;
            if (this.fieldaccess.includes('R') || this.fieldaccess.includes('U')) {
                this.disableinput = false;
            }
        })
    }
    @wire(getObjectInfo, { objectApiName: STUDENT_OBJECT })
    objectInfo;

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: GRADUATION_FIELD })
    GraduationPicklistValues({ data, error }) {
        if (data) {
            this.GpickListvalues = data.values;
            this.error = undefined;
        }
        if (error) {
            this.error = error;
            this.GpickListvalues = undefined;
        }
    }

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: POST_GRADUATION_FIELD })
    PGraduationPicklistValues({ data, error }) {
        if (data) {
            this.FieldData = data;
            this.error = undefined;
        }
        if (error) {
            this.error = error;
            this.FieldData = undefined;
        }
    }
    handleName(event) {
        this.StudentName = event.detail.value;
    }
    handleNumber(event) {
        this.SturollNumber = event.detail.value;
    }
    handleGraduaction(event) {
        this.GraduationValue = event.target.value;
        let key = this.FieldData.controllerValues[event.target.value];
        this.PGpickListvalues = this.FieldData.values.filter(opt => opt.validFor.includes(key));
    }

    handlePGraduation(event) {
        this.PGraduationValue = event.target.value;
    }
    handleChange(event) {
        let key = JSON.stringify(event.detail.value);
        this.LookupValue = JSON.parse(key);
        this.LookupValue.forEach(ele => {
            this.temp = ele;
        })
    }
    handleSave() {
        const isInputsCorrect = [...this.template.querySelectorAll('lightning-input')].reduce((validSoFar, inputField) => {
            inputField.reportValidity();
            return validSoFar && inputField.checkValidity();
        }, true);
        if (isInputsCorrect) {
            console.log("if loop");
            const fields = {};
            fields[STUDENT_NAME.fieldApiName] = this.StudentName;
            fields[STUDENT_ROLL_NUMBER.fieldApiName] = this.SturollNumber;
            fields[GRADUATION_FIELD.fieldApiName] = this.GraduationValue;
            fields[POST_GRADUATION_FIELD.fieldApiName] = this.PGraduationValue;
            fields[PRINCIPAL_LOOKUP.fieldApiName] = this.temp;
            const recordInput = { apiName: STUDENT_OBJECT.objectApiName, fields };
            createRecord(recordInput).then(stu => {
                this.stu = stu.id;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Student created ' + this.stu,
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
    handleCancel() {
        this.isModalOpen = true;
    }
    handlesubmit() {
        this.template.querySelectorAll('lightning-input').forEach(each => { each.value = ''; });
        this.template.querySelectorAll('lightning-combobox').forEach(each => { each.value = ''; });
        this.template.querySelectorAll('lightning-input-field').forEach(each => { each.value = ''; });
        this.isModalOpen = false;
    }
    closeModal() {
        this.isModalOpen = false;
    }
}
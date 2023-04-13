import { LightningElement, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import getRecord from '@salesforce/apex/ObjectAClass.getRecord';

import OBJECTA_OBJECT from '@salesforce/schema/ObjectA__c';
import ALPHABET_FIELD from '@salesforce/schema/ObjectA__c.Alphabet__c';
import NUMBER_FIELD from '@salesforce/schema/ObjectA__c.Numbers__c';
import WORD_FIELD from '@salesforce/schema/ObjectA__c.Words__c';

const columns = [
    { label: 'Id', fieldName: 'Id', type: 'text', sortable: "true" },
    { label: 'Name', fieldName: 'Name', type: 'text', sortable: "true" },
    { label: 'Numbers', fieldName: 'Numbers__c', type: 'text', sortable: "true" },
    { label: 'Alphabet', fieldName: 'Alphabet__c', type: 'text', sortable: "true" },
    { label: 'Words', fieldName: 'Words__c', type: 'text', sortable: "true" }
];

export default class ObjectA extends LightningElement {
    Numberpicvalues;
    Alphabetpicvalues;
    Wordpicvalues;
    isModalOpen = false;
    Numbervalue;
    Alphabetvalue;
    Wordvalue;
    openWord = false;
    columns = columns;
    record;

    @wire(getObjectInfo, { objectApiName: OBJECTA_OBJECT })
    objectInfo;

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: NUMBER_FIELD })
    NumberPicklistValues({ data, error }) {
        if (data) {
            this.Numberpicvalues = data.values;
            this.error = undefined;
        }
        if (error) {
            this.error = error;
            this.Numberpicvalues = undefined;
        }
    }

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: ALPHABET_FIELD })
    Alphabetpicklistvalues({ data, error }) {
        if (data) {
            this.FieldData = data;
            this.error = undefined;
        }
        if (error) {
            this.error = error;
            this.FieldData = undefined;
        }
    }

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: WORD_FIELD })
    Wordpicklistvalues({ data, error }) {
        if (data) {
            this.WordData = data;
            this.error = undefined;
        }
        if (error) {
            this.error = error;
            this.WordData = undefined;
        }
    }
    handleNumber(event) {
        this.Numbervalue = event.target.value;
        this.record = null;
        this.isModalOpen = true;
        let key = this.FieldData.controllerValues[event.target.value];
        this.Alphabetpicvalues = this.FieldData.values.filter(opt => opt.validFor.includes(key));
    }
    handleAlphabet(event) {
        this.Alphabetvalue = event.target.value;
        let key = this.WordData.controllerValues[event.target.value];
        this.Wordpicvalues = this.WordData.values.filter(opt => opt.validFor.includes(key));
        this.openWord = true;
    }
    handleWord(event) {
        this.Wordvalue = event.target.value;
    }
    handlesubmit() {
        getRecord({ num: this.Numbervalue, alp: this.Alphabetvalue, word: this.Wordvalue }).then(data => {
            this.record = data;
        });
        this.isModalOpen = false;
        this.openWord = false;
        this.template.querySelectorAll('lightning-combobox').forEach(each => { each.value = ''; });
    }
    closeModal() {
        this.isModalOpen = false;
        this.openWord = false;
        this.template.querySelectorAll('lightning-combobox').forEach(each => { each.value = ''; });
    }
}
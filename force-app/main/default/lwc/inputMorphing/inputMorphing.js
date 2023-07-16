import { LightningElement,api } from 'lwc';
import { FlowAttributeChangeEvent } from "lightning/flowSupport";

export default class InputMorphing extends LightningElement {

    @api taxNumber = '';
    showTaxId = false;
    isCheckboxDisabled = true;
    @api shortValOftaxNum;
    validationError = '';

    handleTextValue(event){
        this.taxNumber = event.target.value;
        this.shortValOftaxNum = this.taxNumber.slice(-4);
        this.validateInput();
        const taxNumberChangeEvent = new FlowAttributeChangeEvent(
            "taxNumber",
            event.target.value
        );
        this.dispatchEvent(taxNumberChangeEvent);
        const ShotValChangeEvent = new FlowAttributeChangeEvent(
            "shortValOftaxNum",
            this.shortValOftaxNum
        );
        this.dispatchEvent(ShotValChangeEvent);
        if(this.taxNumber.length > 0){
            this.isCheckboxDisabled = false;
        }
    }

    handleShowText(){
        this.showTaxId = !this.showTaxId;
        const inputEl = this.template.querySelector('input');
        inputEl.type = this.showTaxId ? 'text' : 'password';
    }

    validateInput(){
        const regexPattern = /^\d{2}-\d{7}$/;
        if (!regexPattern.test(this.taxNumber)) {
            this.validationError = 'Input value does not match the pattern (xx-xxxxxxx).';
        } else {
            this.validationError = '';
        }
    }

    @api
    validate() {
        if(this.taxNumber !== undefined && this.taxNumber !== null && this.taxNumber.length > 0) { 
            return { isValid: true }; 
        } 
        else if(this.taxNumber === undefined || this.taxNumber.length === 0 || this.taxNumber === null) { 
            return { 
                isValid: false, 
                errorMessage: 'This field is required'
            }; 
        }
    } 
}
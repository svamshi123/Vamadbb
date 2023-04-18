import { LightningElement,api } from 'lwc';

import getDisclaimerText from '@salesforce/apex/OtherFundingResourceCtrl.getBodyOfConsent';

const ESIGN_HELPER_TEXT = 'By checking this box, you are agreeing to the terms and conditions as set out in the disclaimer.';

export default class ESignatureDisclaimer extends LightningElement {

    @api disClaimerText;
    esignatureHelptext = ESIGN_HELPER_TEXT;

    connectedCallback(){
        getDisclaimerText()
        .then((result) => {
            this.disClaimerText = result.disclaimer;
        })
        .catch((error) => {
            const evt = new ShowToastEvent({
                title: errorTitle,
                message: error.body.message,
                variant: errorParam
            });
            this.dispatchEvent(evt);
        });
    }
    handleCheck(event){
        this.dispatchEvent(
            new CustomEvent('checkdisclaimer',
                {
                    bubbles: true,
                    detail: {
                        checked: event.target.checked
                    }
                }
            )
        );
    }
}
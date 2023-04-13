import { LightningElement } from 'lwc';
import { NavigationMixin,CurrentPageReference } from 'lightning/navigation';
import captureDate from "@salesforce/messageChannel/CaptureDate__c";
import { createMessageContext, publish, releaseMessageContext, APPLICATION_SCOPE } from 'lightning/messageService';

export default class Navigate extends NavigationMixin(LightningElement) {
    messageContext = createMessageContext();

    handleClick(){
        let message = {
            mess : 'tese'
        }
        publish(this.messageContext,captureDate,message);
        // this[NavigationMixin.Navigate]({
        //     type: 'standard__recordPage',
        //     attributes: {
        //         recordId: '0032y000007Q4ZKAA0',
        //         objectApiName: 'Contact',
        //         actionName: 'view'
        //     },
        //     state: {
        //         c__filter : 'this',
        //     }
        // }).then(() => {
            
        // });
    }

    
    disconnectedCallback(){
        releaseMessageContext(this.messageContext);
    }    
}
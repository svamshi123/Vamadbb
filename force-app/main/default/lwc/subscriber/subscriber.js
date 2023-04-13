import { LightningElement,wire } from 'lwc';
import {
		APPLICATION_SCOPE,
		MessageContext,
		subscribe
} from 'lightning/messageService';
import messageChannel from '@salesforce/messageChannel/Com__c';
export default class Subscriber extends LightningElement {
		subscription = null;
		recId;
		@wire(MessageContext)
		messageContext;
		
		 connectedCallback() {
        if (this.subscription || this.recordId) {
            return;
        }
        this.subscribeMC();
    }
    subscribeMC() {
        this.subscription = subscribe(this.messageContext, messageChannel, (message) => {
            this.recId = message.recordId
        });
    }
}
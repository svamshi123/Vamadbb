import { LightningElement,wire,api } from 'lwc';
import messageChannel from '@salesforce/messageChannel/Com__c';
import {publish, MessageContext} from 'lightning/messageService';
export default class Publisher extends LightningElement {
		@api recordId;
		@wire(MessageContext)
		messageContext;
		
		
		habdleMessage(){
				publish(this.messageContext, messageChannel, { recordId: this.recordId });
		}
}
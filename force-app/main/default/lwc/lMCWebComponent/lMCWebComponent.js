import { LightningElement } from 'lwc';
import {publish,subscribe,unsubscribe,createMessageContext,releaseMessageContext} from 'lightning/messageService';
import MCSample from '@salesforce/messageChannel/MyMessageChannel__c';
export default class LMCWebComponent extends LightningElement {
		receivedMessage  = '';
		myMessage = '';
		subscribe = null;
		context = createMessageContext();
		
		handleChange(event){
				this.myMessage = event.target.value;
		}
		publishMC(){
				const message = {
						messageToSend : this.myMessage,
						sourceSystem: "From LWC"
				};
				publish(this.context,MCSample,message);
		}
		subscribeMC(){
				if(this.subscribe){
						return;
				}
				this.subscribe = subscribe(this.context,MCSample,(message) =>{
						this.displayMessage(message);
				});
		}
		displayMessage(message) {
         this.receivedMessage = message ? JSON.stringify(message, null, '\t') : 'no message payload';
     }
		unsubscribeMC(){
				unsubscribe(this.subscribe);
				this.subscribe = null;
		}
		disconnectedCallback() {
         releaseMessageContext(this.context);
     }
}
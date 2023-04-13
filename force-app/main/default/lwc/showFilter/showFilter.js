import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import captureDate from "@salesforce/messageChannel/CaptureDate__c";
import { createMessageContext, subscribe, unsubscribe, APPLICATION_SCOPE } from 'lightning/messageService';
export default class ShowFilter extends LightningElement {
    filterValue;
    messageContext = createMessageContext();
    channel;
    @wire(CurrentPageReference)
    currentPageReference;

    connectedCallback() {
        if (this.currentPageReference.state.c__filter) {
            this.filterValue = this.currentPageReference.state.c__filter;
        } else {
            this.filterValue = 'mySites';
        }
        this.handleSubscribe();
    }
    handleSubscribe(){
        this.channel = subscribe(this.messageContext,
                                captureDate,
                                (message) => this.handleMessage(message), 
                                { scope: APPLICATION_SCOPE }
        )
        console.log('channel ###' + JSON.stringify(this.channel));
    }

    handleMessage(message){
        console.log({message});
        console.log('THis ---> '+message.mess);
        this.filterValue = message.mess;
    }

    handleUnsubscribe(){
        unsubscribe(this.channel);
        this.channel = null;
    }

    disconnectedCallback() {
        this.handleUnsubscribe();
    }
}

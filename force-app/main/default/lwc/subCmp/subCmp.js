import { LightningElement,wire,api } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubSub'; 
import { getRecord, getRecordNotifyChange } from 'lightning/uiRecordApi';
import { CurrentPageReference } from 'lightning/navigation'; 

import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled } from 'lightning/empApi';

export default class SubCmp extends LightningElement {
    @api recordId;
    
    channelName;
    message;
    @wire(CurrentPageReference) pageRef; 
    channelName = '/event/testEvent__e';
    subscription = {};
    @wire(getRecord, { recordId: '$recordId', })
    record;
    connectedCallback(){
       // registerListener('publishEvent', this.handleSubsCribeEvent, this); 
       //this.handleSubsCribeEvent();
       getRecordNotifyChange([{recordId: this.recordId}]);
    }

    handleSubsCribeEvent(){
        const thisReference = this;
        const messageCallback = function (response) {
			if(response.data.payload.recordId__c !== undefined && response.data.payload.recordId__c != null){
				console.log('Subs ==> ' + response.data.payload.inputValue__c);
                thisReference.message = response.data.payload.inputValue__c;
                if(response.data.payload.inputValue__c !== undefined && response.data.payload.inputValue__c != null){
                    console.log('Subs String ==> ' + JSON.stringify(response));
                }
                console.log('Subs **** ' + JSON.stringify(response));
               
            }
        };
        subscribe(this.channelName, -1, messageCallback).then((response) => {
            console.log(
                'Subscription request sent to: ',
                JSON.stringify(response.channel)
            );
            this.subscription = response;
        });
    }
}
import { LightningElement,api } from 'lwc';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled }  from 'lightning/empApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ErrorMessage extends LightningElement {
    subscription = {};
    @api channelName = '/event/Flow_Error__e';

    connectedCallback() {       
        this.registerErrorListener();
        this.handlePESubscribe();
    }
    registerErrorListener() {
        onError(error => {
            console.log('Error received: ', JSON.stringify(error));
        });
    }

    handlePESubscribe() {
        const thisReference = this;
        const messageCallback = function(response) {
            var obj = JSON.parse(JSON.stringify(response));
            console.log({obj});
            let error_message;
            if( obj.data.payload.Error_Text_Message__c !== undefined &&  obj.data.payload.Error_Text_Message__c !== null){
                error_message = obj.data.payload.Error_Text_Message__c.substring(0, obj.data.payload.Error_Text_Message__c.indexOf("You can look up ExceptionCode values"));
            }
            console.log('Simplified error: '+ error_message);
            const evt = new ShowToastEvent({
                title: 'Error !',
                message: error_message,
                variant: 'error',
                mode:'sticky'
            });
            thisReference.dispatchEvent(evt);
        };
        subscribe(this.channelName, -1, messageCallback).then(response => {
            console.log('Subscription request sent to: ', JSON.stringify(response.channel));
            this.subscription = response;
        });
    }

    handleUnsubscribe() {
        // Invoke unsubscribe method of empApi
        unsubscribe(this.subscription, response => {
            console.log('unsubscribe method response: ', JSON.stringify(response));
        });
    }

    disconnectedCallback(){
        this.handleUnsubscribe();
    }
}
import { LightningElement,wire,api } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation'; 
import { fireEvent } from 'c/pubSub'; 


import callpublishEvent from '@salesforce/apex/PubSubCtrl.callPlatformEvent'
export default class PubSubCmp extends LightningElement {
    inputVal;
    @wire(CurrentPageReference) pageRef; 
    @api recordId;
    handleInput(event){
        this.inputVal = event.detail.value;
    }
    handlePublishEvent(){
        console.log(' inputVal --> '+this.inputVal);
        callpublishEvent({recordId:this.recordId,inputValue:this.inputVal}).then(data => {
            console.log('event fired');
            // window.close();
        })
    }
}
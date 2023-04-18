import { LightningElement,api } from 'lwc';
import { FlowNavigationNextEvent,FlowNavigationFinishEvent } from 'lightning/flowSupport';


export default class TestFlow extends LightningElement {
    @api reactiveValue;


    handleCloseFlow() {
        const closeAction = { type: "FLOW_FINISH" };
        const closeFlowEvent = new FlowNavigationFinishEvent(closeAction);
        this.dispatchEvent(closeFlowEvent);
    }

}
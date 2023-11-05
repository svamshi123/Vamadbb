import { LightningElement,wire } from 'lwc';
import getAccRecords from "@salesforce/apex/TestWrapperClass.getRecords";

export default class TestWrapper extends LightningElement {
    
    accdata;
    error;

    connectedCallback(){
        this.getRec();
    }
    getRec(){
        getAccRecords().then((data) => {
            this.accdata = data;
        }).catch(error =>{
            this.error = error;
            console.log({error});
        });
    }
    
}
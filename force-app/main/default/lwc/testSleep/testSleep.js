import { LightningElement } from 'lwc';

export default class TestSleep extends LightningElement {
    isSpinner = false;
    connectedCallback(){

        //this.callFunction();
        this.isSpinner = true;
        this.callMethod();
    }


   async callMethod(){
        await this.wait(60);
        this.isSpinner = false;
        console.log('this olls');

    }

    wait(sec){
        return new Promise(resolve =>{
            setTimeout(()=>{
                resolve();
            },sec * 1000);
        })
    }
}
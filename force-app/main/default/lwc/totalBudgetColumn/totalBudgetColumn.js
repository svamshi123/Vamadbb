import { LightningElement,wire,api } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubSub'; 
import { CurrentPageReference } from 'lightning/navigation'; 

export default class TotalBudgetColumn extends LightningElement {

    totalallcolBudget = 0;
    totalallcolrequestedFromSentara = 0;
    totalallcolotherFundingSources = 0;
    totalallcolactualGrantExpenses = 0;
    totalallcoldiff = 0;
    totalallcolpercentage = 0;
    @api totalPersonalExpenses;
    @api totalAdminExpenses;
    @api totalDirectExpenses;
    calArray = [];

    @wire(CurrentPageReference) pageRef; 
		
	connectedCallback() {
        registerListener('personalExpenses', this.handlePersonlaExpenses, this); 
        registerListener('adminExpenses', this.handleAdminExpenses, this); 
        registerListener('directExpenses', this.handleDirectExpenses, this); 
    }

    handlePersonlaExpenses(totalObject) {
        if(this.totalPersonalExpenses === false){
            let arrayIndex = this.calArray.findIndex((row) => row.arrayObjectName == 'personal');
            this.calArray.splice(arrayIndex, 1);
        }
        this.totalPersonalExpenses = false;
        this.calArray.push(...totalObject);
        this.calDate(this.calArray);
    }

    handleAdminExpenses(totalObject){
        if(this.totalAdminExpenses === false){
            let arrayIndex = this.calArray.findIndex((row) => row.arrayObjectName == 'admin');
            this.calArray.splice(arrayIndex, 1);
        }
        this.totalAdminExpenses = false;
        this.calArray.push(...totalObject);
        this.calDate(this.calArray);
    }

    handleDirectExpenses(totalObject){
        if(this.totalDirectExpenses === false){
            let arrayIndex = this.calArray.findIndex((row) => row.arrayObjectName == 'direct');
            this.calArray.splice(arrayIndex, 1);
        }
        this.totalDirectExpenses = false;
        this.calArray.push(...totalObject);
        this.calDate(this.calArray);
    }

    calDate(totalObject){
        this.totalallcolBudget = totalObject.reduce((acc,object) =>{
            return acc + (object.totalcolBudget !== '' ? parseFloat(object.totalcolBudget) : 0);
        },0)
        this.totalallcolrequestedFromSentara = totalObject.reduce((acc,object) =>{
            return acc + (object.totalcolrequestedFromSentara !== '' ? parseFloat(object.totalcolrequestedFromSentara) : 0);
        },0)
        this.totalallcolotherFundingSources = totalObject.reduce((acc,object) =>{
            return acc + (object.totalcolotherFundingSources !== '' ? parseFloat(object.totalcolotherFundingSources) : 0);
        },0)
        this.totalallcolactualGrantExpenses = totalObject.reduce((acc,object) =>{
            return acc + (object.totalcolactualGrantExpenses !== '' ? parseFloat(object.totalcolactualGrantExpenses) : 0);
        },0)
        this.totalallcoldiff = totalObject.reduce((acc,object) =>{
            return acc + (object.totalcoldiff !== '' ? parseFloat(object.totalcoldiff) : 0);
        },0)
        this.totalallcolpercentage = totalObject.reduce((acc,object) =>{
            return acc + (object.totalcolpercentage !== '' ? parseFloat(object.totalcolpercentage) : 0);
        },0)
    }
    @api
    gettotalValues(){
        let totalWrapObject = {
            totalallcolBudget: this.totalallcolBudget,
            totalallcolrequestedFromSentara : this.totalallcolrequestedFromSentara,
            totalallcolotherFundingSources : this.totalallcolotherFundingSources,
            totalallcolactualGrantExpenses : this.totalallcolactualGrantExpenses,
            totalallcoldiff : this.totalallcoldiff,
            totalallcolpercentage : this.totalallcolpercentage
        }
        return totalWrapObject;
    }
    disconnectedCallback() { 
        unregisterAllListeners('personalExpenses', this.handlePersonlaExpenses, this); 
        unregisterAllListeners('adminExpenses', this.handleAdminExpenses, this); 
        unregisterAllListeners('directExpenses', this.handleDirectExpenses, this); 
    } 

}
import { LightningElement ,api,track} from 'lwc';
import upsertData from '@salesforce/apex/OtherFundingResourceCtrl.getDataUpsert';
import getAllBudgets from '@salesforce/apex/OtherFundingResourceCtrl.getAllBudgets';
const DELAY = 1000;
export default class TestBudgetcmp extends LightningElement {
    @api colValue;
    @api columnData;
    @api rowId;
    @api isClearStorage;
    totalcolBudget = 0;
    totalcolotherFundingSources = 0;
    totalcolrequestedFromSentara = 0;
    totalcolactualGrantExpenses = 0;
    totalcoldiff = 0;
    totalcolpercentage = 0;
    finalRowdata = [];
    @api parentRecord = 'a0D2y000002zInzEAE';

    @track rows = [{
        Id: 0,
        recId:'',
        rowIndex:'',
        colexpenseCategory:'',
        expenseCategory:'',
        totalBudget:'',
        otherFundingSources:0.00,
        requestedFromSentara:'',
        actualGrantExpenses:0.00,
        diff:'',
        percentage:'',
        totalcolBudget:0,
        totalcolotherFundingSources:0,
        totalcolrequestedFromSentara:0,
        totalcolactualGrantExpenses:0,
        totalcoldiff:0,
        totalcolpercentage:0
    }];


  

    connectedCallback(){
        console.log('columnData'+ JSON.stringify(this.columnData));
        this.getGrandBudgets();
       
    }

    addRow() {
        let rowId = this.rows.length;
        this.rows.push({ Id: rowId, colexpenseCategory:'', expenseCategory:'', totalBudget: '', otherFundingSources:'', requestedFromSentara:'', actualGrantExpenses: '', diff: '', percentage:''});
    }

    async handleChange(event) {
        let fieldName = event.target.name;
        let fieldValue = event.target.value;
        let rowId = event.target.dataset.id;
        let rowIndex = this.rows.findIndex((row) => row.Id == rowId);
        this.rows[rowIndex]['rowIndex'] = rowIndex;
        this.rows[rowIndex][fieldName] = fieldValue;
         this.rows[rowIndex]['colexpenseCategory'] = 'Other Direct Expenses',
        this.rows[rowIndex]['diff'] =  this.rows[rowIndex]['totalBudget'] > 0 ? parseFloat(this.rows[rowIndex]['totalBudget'] !== '' ? this.rows[rowIndex]['totalBudget']:0) - parseFloat(this.rows[rowIndex]['otherFundingSources']!== ''?this.rows[rowIndex]['otherFundingSources']:0):
        parseFloat(this.rows[rowIndex]['totalBudget']!== ''?this.rows[rowIndex]['totalBudget']:0);
        this.rows[rowIndex]['percentage'] =  (parseFloat(this.rows[rowIndex]['otherFundingSources'] !== '' ? this.rows[rowIndex]['otherFundingSources']:0) / parseFloat(this.rows[rowIndex]['totalBudget']!== ''?this.rows[rowIndex]['totalBudget']:0)) * 100;

        this.totalcolBudget = this.rows.reduce((acc,object) =>{
            return acc + (object.totalBudget !== '' ? parseFloat(object.totalBudget) : 0);
        },0)

        if(this.totalcolBudget !== null && this.totalcolBudget !== undefined){
            this.rows[rowIndex]['totalcolBudget'] = this.totalcolBudget;
        }

        this.totalcolotherFundingSources = this.rows.reduce((acc,object) =>{
            return acc + (object.otherFundingSources !== '' ? parseFloat(object.otherFundingSources) : 0);
        },0)

        if(this.totalcolotherFundingSources !== null && this.totalcolotherFundingSources !== undefined){
            this.rows[rowIndex]['totalcolotherFundingSources'] = this.totalcolotherFundingSources;
        }
        
        this.totalcolrequestedFromSentara = this.rows.reduce((acc,object) =>{
            return acc + (object.requestedFromSentara !== '' ? parseFloat(object.requestedFromSentara) : 0);
        },0)

        if(this.totalcolrequestedFromSentara !== null && this.totalcolrequestedFromSentara !== undefined){
            this.rows[rowIndex]['totalcolrequestedFromSentara'] = this.totalcolrequestedFromSentara;
        }
        
        this.totalcolactualGrantExpenses = this.rows.reduce((acc,object) =>{
            return acc + (object.actualGrantExpenses !== '' ? parseFloat(object.actualGrantExpenses) : 0);
        },0)

        if(this.totalcolactualGrantExpenses !== null && this.totalcolactualGrantExpenses !== undefined){
            this.rows[rowIndex]['totalcolactualGrantExpenses'] = this.totalcolactualGrantExpenses;
        }
        
        this.totalcoldiff = this.rows.reduce((acc,object) =>{
            return acc + (object.diff !== '' ? parseFloat(object.diff) : 0);
        },0)
        if(this.totalcoldiff !== null && this.totalcoldiff !== undefined){
            this.rows[rowIndex]['totalcoldiff'] = this.totalcoldiff;
        }
        
        this.totalcolpercentage = this.rows.reduce((acc,object) =>{
            return acc + (object.percentage !== '' ? parseFloat(object.percentage) : 0);
        },0)

        if(this.totalcolpercentage !== null && this.totalcolpercentage !== undefined){
            this.rows[rowIndex]['totalcolpercentage'] = this.totalcolpercentage;
        }
       console.log('rows'+ JSON.stringify(this.rows));
       window.clearTimeout(this.delayTimeout);
       this.delayTimeout = setTimeout(() => {
            this.updateRecord(this.rows,rowIndex);
       },DELAY);
        
    }
    async updateRecord(rowData,rowIndex){
        await this.upsertGrandBudgetRecord(rowData,rowIndex);
    }

     upsertGrandBudgetRecord(rowData,rowIndex){
        upsertData({recData:JSON.stringify(rowData),parRecId:this.parentRecord}).then((data) => {
            console.log(JSON.stringify(data));
            if(data != null){
                this.rows[rowIndex]['recId'] = data[rowIndex];
            }
        }).catch((error) =>{
            console.log({error});
        })
    }
    getGrandBudgets(){
        getAllBudgets({appId: this.parentRecord}).then((data) =>{
            console.log(JSON.parse(data));
            let returnData = JSON.parse(data);
            if(Array.isArray(returnData.objWrapList) && returnData.objWrapList.length > 0){
                this.rows = returnData.objWrapList;
                this.totalcolBudget = returnData.applicationDetails.Project_Total_Direct_Expenses__c;
                this.totalcolotherFundingSources = returnData.applicationDetails.Project_Total_Direct_Other_Fund_Source__c;
                this.totalcolrequestedFromSentara = returnData.applicationDetails.Project_Total_Direct_Requested__c;
                this.totalcolactualGrantExpenses = returnData.applicationDetails.Project_Total_Direct_Actual__c;
            }
           
        })
    }
    handleDelete(event) {
        let rowId = event.target.dataset.id;
        if(this.rows.length > 1){
            let rowIndex = this.rows.findIndex((row) => row.Id == rowId);
            //Total Budget
            let colBudget = this.rows[rowIndex].totalBudget !== null ? this.rows[rowIndex].totalBudget : 0;
            this.totalcolBudget = parseFloat(this.totalcolBudget) - colBudget;
            //Other Funding Source
            let colOtherFundingSource = this.rows[rowIndex].otherFundingSources !== null ? this.rows[rowIndex].otherFundingSources : 0;
            this.totalcolotherFundingSources = parseFloat(this.totalcolotherFundingSources) - colOtherFundingSource;
            // Request From Santara
            let colRequestFromSantara = this.rows[rowIndex].requestedFromSentara !== null ? this.rows[rowIndex].requestedFromSentara : 0;
            this.totalcolrequestedFromSentara = parseFloat(this.totalcolrequestedFromSentara) - colRequestFromSantara;
            //Actual Grant Expenses
            let colactualGrantExpenses = this.rows[rowIndex].actualGrantExpenses !== null ? this.rows[rowIndex].actualGrantExpenses : 0;
            this.totalcolactualGrantExpenses = parseFloat(this.totalcolactualGrantExpenses) - colactualGrantExpenses;
            //Diff of Other Funding Source from Total Budget
            let coldiff = this.rows[rowIndex].diff !== null ? this.rows[rowIndex].diff : 0;
            this.totalcoldiff = parseFloat(this.totalcoldiff) - coldiff;
            //Percentage of Other Funding Source from Total Budget
            let colpercentage = this.rows[rowIndex].percentage !== null ? this.rows[rowIndex].percentage : 0;
            this.totalcolpercentage = parseFloat(this.totalcolpercentage) - colpercentage;
            this.rows.splice(rowIndex, 1);
        }
    }
  
}
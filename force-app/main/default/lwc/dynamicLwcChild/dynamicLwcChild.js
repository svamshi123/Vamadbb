import { LightningElement,api,wire } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import getAccount from '@salesforce/apex/AccountsList.getAccounts';


import firstPageTemplate from './firstPageTemplate.html';
import secondPageTemplate from './secondPageTemplate.html';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import conMainObject from '@salesforce/schema/Contact';
import conFirstName from '@salesforce/schema/Contact.FirstName';
import conLastName from '@salesforce/schema/Contact.LastName';
import conPhone from '@salesforce/schema/Contact.Phone';
import conEmail from '@salesforce/schema/Contact.Email';
import conDepartment from '@salesforce/schema/Contact.Department';
import conDescription from '@salesforce/schema/Contact.Description';
import conAccount from '@salesforce/schema/Contact.AccountId';



export default class DynamicLwcChild extends LightningElement {
		@api template;
		Name;
		accdata;
		dataacc;
		ranger;
		left;
		top;
		checked = false;
		accId;
		isModalOpen = false;
		firstName = '';
		lastName = '';
		phoneNo= '';
		emailId='';
		departmentVal='';
		descriptionVal='';
		visible = false;
		cvisible = false;
		error = false;
		cerror = false;
		accName;
		
		render() {
				switch(this.template){
						case 'firstPage':
								return firstPageTemplate;
						case 'secondPage':
								return secondPageTemplate;
						default:
								return firstPageTemplate;
				}
		}
		@wire(getAccount)
		accountList(values){
				this.dataacc = values;
				const{data,error} = values;
				if(data){
						this.accdata = data;
				}
		}

		handleNameChange(event){
				this.Name = event.target.value;
		}
		createAccount() {
				const fields = {};
				fields[NAME_FIELD.fieldApiName] = this.Name;
				const recordInput = { apiName: ACCOUNT_OBJECT.objectApiName, fields };
				createRecord(recordInput).then(() => {
						refreshApex(this.dataacc)
						this.visible = true;
				}).catch(() => {
					this.error = true;
				});
		}
		hideData(){
				this.ranger = " ";
				this.checked = false;
		}
		showData(event){
				this.checked = true;
				this.ranger = event.currentTarget.dataset.rangerid;
				this.left = event.clientX;
				this.top = event.clientY;
		}
		get assignClass() { 
				return this.active ? '' : 'slds-hint-parent';
		}
		createContact(event){
				this.isModalOpen = true;
				this.accName = event.currentTarget.dataset.id
				this.accId = event.currentTarget.dataset.rangerid;	
		}
		closeModal(){
				this.isModalOpen = false;
		}
		contactChangeVal(event) {      
				if(event.target.label ==='First Name'){
						this.firstName = event.target.value;
				}
				if(event.target.label === 'Last Name'){
						this.lastName = event.target.value;
				}            
				if(event.target.label==='Phone'){
						this.phoneNo = event.target.value;
				}
				if(event.target.label==='Email'){
						this.emailId = event.target.value;
				}
				if(event.target.label==='Department'){
						this.departmentVal = event.target.value;
				}
				if(event.target.label==='Description'){
						this.descriptionVal = event.target.value;
				}          
		}
		submitDetails(){
				const fields = {};
				fields[conFirstName.fieldApiName] = this.firstName;
				fields[conAccount.fieldApiName] = this.accId;
				fields[conLastName.fieldApiName] = this.lastName;
				fields[conPhone.fieldApiName] = this.phoneNo;
				fields[conEmail.fieldApiName] = this.emailId;
				fields[conDepartment.fieldApiName] = this.departmentVal;
				fields[conDescription.fieldApiName] = this.descriptionVal;
				const recordInput = { apiName: conMainObject.objectApiName, fields };
				createRecord(recordInput).then(() => {
						refreshApex(this.dataacc);
						this.isModalOpen = false;
						this.cvisible = true;
				}).catch(() => {
							this.cerror = true;
				});
		}
		closenotify(){
				this.visible = false;
				this.cvisible = false;
				this.error = false;
				this.cerror = false;
		}
}
import { LightningElement } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import eventObject from '@salesforce/schema/Event';
import eventSubject from '@salesforce/schema/Event.Subject';
import eventStartDateTime from '@salesforce/schema/Event.StartDateTime';
import eventOEndDateTime from '@salesforce/schema/Event.EndDateTime';
import eventWhoId from '@salesforce/schema/Event.WhoId';
import eventWhatId from '@salesforce/schema/Event.WhatId';
import eventOwnerId from '@salesforce/schema/Event.OwnerId';
import eventLocation from '@salesforce/schema/Event.Location';
import createEventRecord from '@salesforce/apex/lwcCustomLookupController.createEventRecord';
import { NavigationMixin } from 'lightning/navigation';
export default class CreateEvent extends NavigationMixin(LightningElement) {
		value = 'None';
		StartdateTimeFieldValue;
		EnddateTimeFieldValue;
		accId;
		accName;
		conId;
		conName;
		userId;
		userName;
		location;
		get options() {
				return [
						{ label: '--None--', value: 'None'},
						{ label: 'Call', value: 'Call' },
						{ label: 'Email', value: 'Email' },
						{ label: 'Meeting', value: 'Meeting' },
						{ label: 'Send Letter/Quote', value: 'Letter/Quote' },
						{ label: 'Other', value: 'Other' },
				];
		}
		handleSubjectOptions(event){
				this.value = event.detail.value;
		}
		handleStartDateTimeChange(event){
				this.StartdateTimeFieldValue = event.target.value;
		}
		handleEndDateTimeChange(event){
				this.EnddateTimeFieldValue = event.target.value;
		}
		handleconLookup(event){
				this.conId = event.detail.recordId;
				this.conName = event.detail.recordName;
				console.log(this.conId);
		}
		handleaccLookup(event){
				this.accId = event.detail.recordId;
				this.accName = event.detail.recordName;
				console.log(this.accId);
		}
		handleuseLookup(event){
				this.userId = event.detail.recordId;
				this.userName = event.detail.recordName;
				console.log(this.userId);
		}
		handlelocation(event){
				this.location = event.detail.value;
				console.log(this.location);
		}
		createEvebt(){
				createEventRecord({subject:this.value,startdate: this.StartdateTimeFieldValue,enddate: this.EnddateTimeFieldValue,con: this.conId,acc: this.accId,user: this.userId,lolocation: this.location}).then((data) => {
						this.dispatchEvent(
								new ShowToastEvent({
										title: 'Success',
										message: 'Event Created',
										variant: 'success',
								}),
						);
						this[NavigationMixin.Navigate]({
								type:'standard__recordPage',
								attributes:{
										recordId: this.conId,
										objectApiName: 'contact',
										actionName: 'view'
								},
						});
				}).catch((error) => {
						this.dispatchEvent(
								new ShowToastEvent({
										title: 'Success',
										message: 'Not Created',
										variant: 'error',
								}),
						);
				});
		}
}
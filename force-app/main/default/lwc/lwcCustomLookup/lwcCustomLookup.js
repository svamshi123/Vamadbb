import { LightningElement,api } from 'lwc';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';
import getResults from '@salesforce/apex/lwcCustomLookupController.getResults';
export default class LwcCustomLookup extends LightningElement {
		@api objectName = 'Account';
		@api fieldName = 'Name';
		@api iconName = 'action:new_account';
		@api selectRecordId;
		@api selectRecordName;
		//	@api objectName = 'Account';
		//  @api fieldName = 'Name';
		// @api selectRecordId = '';
		// @api selectRecordName;
		@api Label;
		@api searchRecords = [];
		@api required = false;
		// @api iconName = 'action:new_account'
		@api LoadingText = false;
		messageFlag = false;
		iconFlag =  true;
		clearIconFlag = false;
		inputReadOnly = false;

		searchField(event) {
				var currentText = event.target.value;
				this.LoadingText = true;

				getResults({ ObjectName: this.objectName, fieldName: this.fieldName, value: currentText  }).then(result => {
						this.searchRecords= result;
						this.LoadingText = false;

						this.txtclassname =  result.length > 0 ? 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open' : 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
						if(currentText.length > 0 && result.length == 0) {
								this.messageFlag = true;
						}
						else {
								this.messageFlag = false;
						}

						if(this.selectRecordId != null && this.selectRecordId.length > 0) {
								this.iconFlag = false;
								this.clearIconFlag = true;
						}
						else {
								this.iconFlag = true;
								this.clearIconFlag = false;
						}
				}).catch(error => {
						console.log('-------error-------------'+error);
						console.log(error);
				});

		}
		setSelectedRecord(event) {
				var currentText = event.currentTarget.dataset.id;
				this.txtclassname =  'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
				this.iconFlag = false;
				this.clearIconFlag = true;
				this.selectRecordName = event.currentTarget.dataset.name;
				var selectName = event.currentTarget.dataset.name;
				this.selectRecordId = currentText;
				this.inputReadOnly = true;
				const selectedEvent = new CustomEvent('selected', { detail: {selectName}, });
				// Dispatches the event.
				this.dispatchEvent(selectedEvent);
				// This is the event we use to notify flow
				const attributeChangeEvent = new FlowAttributeChangeEvent('selectRecordId', currentText);
				this.dispatchEvent(attributeChangeEvent);
		}
		resetData(event) {
				this.selectRecordName = "";
				this.selectRecordId = "";
				this.inputReadOnly = false;
				this.iconFlag = true;
				this.clearIconFlag = false;

		}
}
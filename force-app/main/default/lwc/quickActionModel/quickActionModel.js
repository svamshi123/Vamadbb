import { LightningElement ,api, wire, track} from 'lwc';
import modal from '@salesforce/resourceUrl/model';
import { loadStyle} from 'lightning/platformResourceLoader';


import getAccountList from '@salesforce/apex/AccountHelper.getAccountList';

export default class QuickActionModel extends LightningElement {
    @api recordId;
    error;
    @track accList
    columns = [
        {
            label: 'Account name',
            fieldName: 'Name',
            type: 'text',
            sortable: true 
        },
        {
            label: 'Type',
            fieldName: 'Type',
            type: 'text',
            sortable: true
        },
        {
            label: 'Annual Revenue',
            fieldName: 'AnnualRevenue',
            type: 'Currency',
            sortable: true
        },
        {
        label: 'Phone',
        fieldName: 'Phone',
        type: 'phone',
        sortable: true
        },
        {
            label: 'Website',
            fieldName: 'Website',
            type: 'url',
            sortable: true
        },
        {
            label: 'Rating',
            fieldName: 'Rating',
            type: 'test',
            sortable: true
        }
    ];

    
    @wire(getAccountList)
    wiredAccounts({error,data}) {
        if (data) {
            this.accList = data;
        } else if (error) {
            this.error = error;
        }
    }

    connectedCallback() {
        Promise.all([
            loadStyle(this, modal)
        ])
    }

}
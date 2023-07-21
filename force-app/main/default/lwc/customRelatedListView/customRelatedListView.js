import { LightningElement,api,wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

import getFieldTypes from "@salesforce/apex/CustomRelatedListViewCtrl.getFieldTypes";
import getRecords from "@salesforce/apex/CustomRelatedListViewCtrl.getRecords";
import getLabelWithAPI from "@salesforce/apex/CustomRelatedListViewCtrl.getLabelWithAPI";
export default class CustomRelatedListView extends LightningElement {
    @api parentObjectAPIName;
    @api recordId;
    @api childObjectAPIName;
    @api showDisplayLable;
    @api fieldsToDisplay;
    @api pageURL;
    columns;
    fetchData;
    fieldMap;
    count = 0;
    themeInfo;


    @wire(getObjectInfo, { objectApiName: "$childObjectAPIName" })
    handleResult({error, data}) {
        if(data){
            let objectInformation = data;
            this.themeInfo = objectInformation.themeInfo || {};
        }
        if(error) {
            console.log({error});
        }
        
    }

    get iconColor() {
        let color = "background-color: " +
            (this.themeInfo && this.themeInfo.color ?
                ("#" + this.themeInfo.color) : "") +
            ";";
        return color;
    }

    connectedCallback(){
        if(this.fieldsToDisplay !== null || this.fieldsToDisplay !== undefined){
            this.getlabel();
        }
    }
    getlabel(){
        let fields = this.fieldsToDisplay.split(',');
        getLabelWithAPI({ selectedFields: fields, nameObject: this.childObjectAPIName }).then((data) =>{
            this.fieldMap = data;
            this.handleFetchFieldTypes();
        }).catch((error) =>{
            console.log({error});
        })
    }

    handleFetchFieldTypes() {
        let fields = this.fieldsToDisplay.split(',');
        getFieldTypes({ selectedFields: fields, nameObject: this.childObjectAPIName }).then(result => {
            let selected = Object.keys(result);
            this.columns = selected.map(field => {
                const dType = result[field];
                if (dType === 'STRING' || dType === 'ID') {
                    if(field === 'Name'){
                        return{
                            label: this.fieldMap[field],
                            fieldName: 'recordURL',
                            type: 'url',
                            typeAttributes: {
                                label: {
                                    fieldName: 'Name'
                                }
                            }
                        }
                    }else{
                        return {
                            label: this.fieldMap[field],
                            fieldName: field
                        };
                    }
                } else if (dType === 'DATE') {
                    return {
                        label: this.fieldMap[field],
                        fieldName: field,
                        type: 'date'
                    };
                } else if (dType === 'DATETIME') {
                    return {
                        label: this.fieldMap[field],
                        fieldName: field,
                        type: 'datetime'
                    };
                } else if (dType === 'Integer') {
                    return {
                        label: this.fieldMap[field],
                        fieldName: field,
                        type: 'Integer'
                    };
                } else if (dType === 'BOOLEAN') {
                    return {
                        label: this.fieldMap[field],
                        fieldName: field,
                        type: 'text'
                    };
                } else {
                    return {
                        label: this.fieldMap[field],
                        fieldName: field
                    };
                }
            });
            this.fetchRecords();
        }).catch(error => {
            console.log(error);
        });
    }

    fetchRecords(){
        getRecords({childObjAPIName: this.childObjectAPIName,
            parentObjAPIName : this.parentObjectAPIName,
            parRecId:this.recordId,
            fields:this.fieldsToDisplay}).then((data) =>{
            this.fetchData = data;
            if(this.fetchData){
                this.fetchData.forEach(item => item['recordURL'] = '/'+this.pageURL+'/' +item['Id'] +'/view');
            }
            this.count = this.fetchData.length;
        }).catch((error) =>{
            console.log({error});
        });
    }
}
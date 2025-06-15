import { LightningElement,track,wire } from 'lwc';

import getMetaDataRecords from '@salesforce/apex/MetadataController.fetchMetadataRecords';

export default class DisplayMetadataRecords extends LightningElement {
    isRenderded = false;
    @track metaDataRecords;
    childMedataRecords = [];
    error;
    filterdedMetadataRecords;
    selectedChildMetaRecords = [];

    connectedCallback(){
        if(this.isRenderded === false){
            this.getRecords();
            this.isRenderded = true;
        }
    }

    getRecords(){
        getMetaDataRecords().then((data) =>{
            let filterdedMetadataRecords = [];
            console.log('data => ' + JSON.stringify(JSON.parse(data)));
            this.metaDataRecords = JSON.parse(data).map(parent => {
                if (parent.parentMetaDefaultService === true) {
                    const { childMetaDataList, ...parentWithoutChildren } = parent;
                    this.filterdedMetadataRecords = parentWithoutChildren;
                    this.childMedataRecords = this.childMedataRecords.concat(parent.childMetaDataList);
                    return {
                        ...parent,
                        showParentAddIcon: false,
                        showParentRemoveIcon: true
                    };
                }
                return parent;
            });

        }).catch((erorr) =>{
            this.error = error;
            console.log('erorr => ' + JSON.stringify(erorr));
        })
    }

    handleJumpToChildRecords(event){
        let rowIndex = this.metaDataRecords.findIndex((row) => row.parentMetaRecId == event.currentTarget.dataset.id);
        this.metaDataRecords.map(metaRecord => {
            if(metaRecord.parentMetaRecId === event.currentTarget.dataset.id){
                metaRecord.showParentRemoveIcon = true;
                metaRecord.showParentAddIcon = false;
            } else {
                metaRecord.showParentRemoveIcon = false;
                metaRecord.showParentAddIcon = true;
            }
        })
        this.metaDataRecords = [...this.metaDataRecords];

        this.childMedataRecords = this.filterChildMetaData(this.metaDataRecords, event.currentTarget.dataset.id);
        this.childMedataRecords.map(metaRecord => {
            metaRecord.showChildRemoveIcon = false;
            metaRecord.showChildAddIcon = true;
        })

        this.childMedataRecords = [...this.childMedataRecords];

        let filtereObject = this.metaDataRecords[rowIndex];
        const { childMetaDataList, ...parentRecordWithoutChildren } = filtereObject;
        this.filterdedMetadataRecords = parentRecordWithoutChildren;
        this.selectedChildMetaRecords = [];
    }

    handleClose(event){
        this.metaDataRecords.map(metaRecord => {
            if(metaRecord.parentMetaRecId === event.currentTarget.dataset.id){
                metaRecord.showParentRemoveIcon = false;
                metaRecord.showParentAddIcon = true;
            }
        })
        this.metaDataRecords = [...this.metaDataRecords];
        this.childMedataRecords = [];
        this.selectedChildMetaRecords = [];
        this.filterdedMetadataRecords = [];
        
    }

    filterChildMetaData(metaDataRecords, childParentMetaRecId) {
        return metaDataRecords
            .flatMap(parentRecord => parentRecord.childMetaDataList)
            .filter(childRecord => childRecord.childParentMetaRecId === childParentMetaRecId);
    }

    handleAddChildRecords(event){
        const id = event.currentTarget.dataset.id;
        this.childMedataRecords = this.childMedataRecords.map(metaRecord => {
        if (metaRecord.childMetaRecId === id) {
            metaRecord.showChildRemoveIcon = true;
            metaRecord.showChildAddIcon = false;
            
            // Add to selectedChildMetaRecords if not already present
            if (!this.selectedChildMetaRecords.some(record => record.childMetaRecId === id)) {
                this.selectedChildMetaRecords.push(metaRecord);
            }
        }
            return metaRecord;
        });
        this.filterdedMetadataRecords.childMetaDataList = [...this.selectedChildMetaRecords];

        // this.childMedataRecords.map(metaRecord => {
        //     if(metaRecord.childMetaRecId === event.currentTarget.dataset.id){
        //         metaRecord.showChildRemoveIcon = true;
        //         metaRecord.showChildAddIcon = false;
        //         this.selectedChildMetaRecords.push(metaRecord);
        //     }
        // });
        // this.childMedataRecords = [...this.childMedataRecords];
        // this.filterdedMetadataRecords.childMetaDataList = this.selectedChildMetaRecords;
    }

    handleChildClose(event){
        const id = event.currentTarget.dataset.id;
         this.childMedataRecords = this.childMedataRecords.map(metaRecord => {
        if (metaRecord.childMetaRecId === id) {
            metaRecord.showChildRemoveIcon = false;
            metaRecord.showChildAddIcon = true;
            
            this.selectedChildMetaRecords = this.selectedChildMetaRecords.filter(record => record.childMetaRecId !== id);
        }
        return metaRecord;
        });

        this.filterdedMetadataRecords.childMetaDataList = [...this.selectedChildMetaRecords];
        // this.childMedataRecords.map(metaRecord => {
        //     if(metaRecord.childMetaRecId === event.currentTarget.dataset.id){
        //         metaRecord.showChildRemoveIcon = false;
        //         metaRecord.showChildAddIcon = true;
        //     }
        // });
        // this.filterdedMetadataRecords.childMetaDataList = this.filterRemovedChildMetaData(this.filterdedMetadataRecords,event.currentTarget.dataset.id);
    }

    filterRemovedChildMetaData(metaDataRecords, childMetaRecIdToRemove) {
       return metaDataRecords.childMetaDataList.filter(childRecord => childRecord.childMetaRecId !== childMetaRecIdToRemove);
    }

    handleSave(){
        console.log('this.filterdedMetadataRecords' + JSON.stringify(this.filterdedMetadataRecords));
    }

    get displayDilterdedMetadataRecords(){
        return JSON.stringify(this.filterdedMetadataRecords);
    }

}
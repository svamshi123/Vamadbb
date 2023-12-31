import { LightningElement,api,track } from 'lwc';

export default class LightningFileUpload extends LightningElement {

    @api fileRowId;
    @api labelName;
    @track rows = [];
    isfileUploded = false;

    handleFileUploaded(event) {
        console.log('this Event');
        this.isfileUploded = true;
        let file = event.target.files[0];
        let rowId = event.target.dataset.id;
        let reader = new FileReader();
        let fileContents;
        reader.onload = e => {
            let base64 = 'base64,';
            let content = reader.result.indexOf(base64) + base64.length;
            fileContents = reader.result.substring(content);
            this.rows[rowId]['fileTitle'] = file.name;
            this.rows[rowId]['fileData'] = fileContents;
            console.log(JSON.stringify(this.rows));
           
        };
        reader.readAsDataURL(file);
        console.log('this Event End');
        this.dispatchFileEvent(this.rows);
    }

    dispatchFileEvent(rows){
        console.log(JSON.stringify(rows));
        const uploadedEvent = new CustomEvent('uploadedfile', { detail: {
            fileInfo:rows,
            isfileUploded: this.isfileUploded
        }});
        this.dispatchEvent(uploadedEvent);
    }
}
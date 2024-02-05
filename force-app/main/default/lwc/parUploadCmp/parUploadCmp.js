import { LightningElement,api , track} from 'lwc';

export default class ParUploadCmp extends LightningElement {
    @api recordId;
    @track rows = [{index : 1}]

    handleRows(){
        this.rows.push({index : this.rows.length +1 })
        console.log(this.rows)
    }

    handleSubmit(){
        let comList = this.template.querySelectorAll('c-dependent-picklist-component')
        console.log(comList.dependentValue)
    }
}
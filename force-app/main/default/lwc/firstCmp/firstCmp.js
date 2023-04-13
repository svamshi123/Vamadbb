import { LightningElement,api } from 'lwc';
export default class FirstCmp extends LightningElement {
	handleSecCmp(){
		this.dispatchEvent(new CustomEvent('gotosecondcmp'));
	}
}
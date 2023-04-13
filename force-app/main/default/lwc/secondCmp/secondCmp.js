import { LightningElement,api } from 'lwc';
export default class SecondCmp extends LightningElement {
		handleFirstCmp(){
					this.dispatchEvent(new CustomEvent('gotofirstcmp'));
		}
}
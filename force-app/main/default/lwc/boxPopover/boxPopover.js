import { LightningElement,api } from 'lwc';
export default class BoxPopover extends LightningElement {
		ranger;
		top = 50;
		left = 50;
		@api
		get myranger(){
				return this.ranger;
		}

		set myranger(value) {
				this.ranger = value;
		}

		@api
		get topmargin(){
				return this.top;
		}

		set topmargin(value) {
				this.top = value;
		}

		@api
		get leftmargin(){
				return this.left;
		}

		set leftmargin(value) {
				this.left = value;
		}
		get boxClass() { 
				return `background-color:white; top:${this.top - 280}px; left:${this.left}px`;
		}
}
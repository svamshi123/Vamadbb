import { LightningElement } from 'lwc';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import bootstrap from '@salesforce/resourceUrl/bootstrap500';
import jquery from '@salesforce/resourceUrl/jQuery224';
import { NavigationMixin } from 'lightning/navigation';
export default class Main extends NavigationMixin(LightningElement) {

		renderedCallback() {
				Promise.all([
						loadStyle(this, bootstrap),
						loadScript(this, jquery)
				]).then(() => {
						console.log("loaded");
				});
		}
		handleSecondCmp(){
				console.log("second");
				this.template.querySelector('lightning-tabset').activeTabValue = "secondcmp";
		}
		handleFirstCmp(){
					this.template.querySelector('lightning-tabset').activeTabValue = "firstcmp";
		}
}
import { LightningElement } from 'lwc';
export default class TestrichText extends LightningElement {
		
		richtext = '<div align="center">Chat Started: Friday, April 16, 2021, 12:45:46 (+0000)</div><div align="center">Agent vamshi t</div><div align="center">Agent vamshi t requested a file transfer</div><div align="center">File transfer succeeded.';
		temtext = this.richtext;
		renderedCallback(){
				console.log(this.temtext)
				 const container = this.template.querySelector('.my-content');
				 container.innerHTML = this.temtext;
		}
    
}
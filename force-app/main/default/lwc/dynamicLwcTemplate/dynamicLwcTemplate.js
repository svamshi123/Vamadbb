import { LightningElement } from 'lwc';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import bootstrap from '@salesforce/resourceUrl/bootstrap500';
import jquery from '@salesforce/resourceUrl/jQuery224';
import popper from '@salesforce/resourceUrl/popper';
import fetchUserDetail from '@salesforce/apex/loginUserProfileCtrl.fetchUserDetail';
export default class DynamicLwcTemplate extends LightningElement {
		templateToChild;
		Profilepic;
		username;
		userarray = [];
		isModalOpen = false;
		Username;
		password;
		isLoaded = false;
		navigate = false;
		display = false;
		renderedCallback() {
				Promise.all([
						loadStyle(this, bootstrap),
						loadScript(this, popper),
						loadScript(this, jquery)
				]).then(() => {
						console.log("loaded");
				});
		}
		
		handleTemplate(event) {
        this.templateToChild = event.target.name;
    }
		

		handleLogin(){
				this.isModalOpen = true;
		}
		handleOnchange(event){
				this.Username = event.detail.value;
		}
		handlePassword(event){
				this.password = event.detail.value;
		}
		closeModal(){
				this.isModalOpen = false;
		}
		submitDetails(){
				fetchUserDetail({USERNAME:this.Username,PASSWORD:this.password}).then(data =>{
						this.isLoaded = !this.isLoaded;
						console.log({data})
						this.userarray = data[0]
						console.log(this.userarray)
						if(!this.userarray.length){
								this.Profilepic = data[0].FullPhotoUrl;
								this.username = data[0].Name;
								this.isModalOpen = false;
								this.isLoaded = false;
								this.navigate = true;
								this.display = true;
						}
				})
		}
		handleLogout(){
				this.navigate = false;
				this.display = false;
		}
}
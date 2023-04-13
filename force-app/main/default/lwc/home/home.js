import { LightningElement,wire } from 'lwc';
import fetchUserDetail from '@salesforce/apex/loginUserProfileCtrl.fetchUserDetail';

export default class Home extends LightningElement {
		Profilepic;
		username;
		userarray = [];
		isModalOpen = false;
		Username;
		password;
		isLoaded = false;

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
						this.userarray = data[0]
						console.log(this.userarray)
						if(!this.userarray.length){
								this.Profilepic = data[0].FullPhotoUrl;
								this.username = data[0].Name;
								this.isModalOpen = false;
								this.isLoaded = false;
						}
				})
		}
		handleLogout(){
				//this.Profilepic = ' ';
		}
}
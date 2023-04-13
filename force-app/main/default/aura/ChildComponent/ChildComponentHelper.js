({
     getAllAccounts : function(component,event) {
        //Calling base component's helper method
        this.getDataFromServer(component,
                                 "c.getAccounts",
                                 function(response){
                                     if(response){
                                         component.set("v.ListAcc", response);
                                     }
                                 }
                                );
          
    },
})
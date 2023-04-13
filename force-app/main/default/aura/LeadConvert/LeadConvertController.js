({
    doInit : function(component, event, helper) { 
       // var dismissActionPanel = $A.get("e.force:closeQuickAction"); 
        //dismissActionPanel.fire();
        console.log("recordId"+component.get("v.recordId"));
        var action = component.get("c.leadCon");
        action.setParams({
            "leadId": component.get("v.recordId")
        });
        /*action.setCallback(this,function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                console.log(response.getReturnValue());
                if(response.getReturnValue()){
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "type": "success",
                        "title": "Success!",
                        "message": "Converted successfully."
                    });
                    toastEvent.fire();
                }else{
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "type": "error",
                        "title": "Error!",
                        "message": "Not Converted."
                    });
                    toastEvent.fire(); 
                }
            }else if(state === "ERROR"){
                var error =  response.getError();
                if(error){
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "type": "error",
                        "title": "Error!",
                        "message": errors[0].message
                    });
                    toastEvent.fire(); 
                }
            }
        })*/
        $A.enqueueAction(action);
    }
})
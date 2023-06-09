({
    getDataFromServer : function(component, method, callback, params ){
        console.log(params);
        var action = component.get(method);
        if (params) {
            action.setParams(params);
        }
        action.setCallback(this,function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                callback.call(this,response.getReturnValue());  
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    alert('errors'+errors);   
                }
            }
        });
        $A.enqueueAction(action);
    },
})
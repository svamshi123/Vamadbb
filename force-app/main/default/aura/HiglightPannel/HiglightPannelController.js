({
    doInit : function(cmp, event, helper) {
        var action = cmp.get("c.fetchFields");
        action.setParams({ 
            recordId : cmp.get("v.recordId"),
            objectName : cmp.get("v.sObjectName"),
            fieldSetName : cmp.get("v.fieldSetName")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                let res = response.getReturnValue();
                cmp.set('v.nameField',res.nameField);
                cmp.set('v.objectLabel',res.objectLabel);
                cmp.set('v.fieldsAPI',res.fieldsAPI);
                cmp.set('v.icoName',res.icoName);
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log( errors[0].message);
                    }
                } else {
                   console.log("Error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    gotoURL : function(cmp, event, helper) {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url":"/apex/ApplicationPreviewPDF"// please provide the VF Page Name of yours
        });
        urlEvent.fire();
    }
})
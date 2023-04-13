({
    loadRecord : function(component) {
        var stdFields = component.get("v.standardFields");
        var extFields = component.get("v.fields");
        var fields = stdFields + (extFields != null ? ','+ extFields : "");
        
        var action = component.get("c.getObject"); 
        action.setParams({
            recordId: component.get("v.recordId"),
            objectType: component.get("v.objectType"),
            fields: fields
        });
        
        action.setCallback(this, function(a) {
            console.log(a.getReturnValue());
            component.set("v.record", a.getReturnValue());
            
            var cc = component.getConcreteComponent();
            cc.getDef().getHelper().postGetHook(cc);
        });
        
        $A.enqueueAction(action); 
    }
})
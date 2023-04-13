({
	doInit : function(component, event, helper) {
		console.log('event firing');
       var cmpEvt = component.getEvent("bubbleCaptureEvent");
        cmpEvt.fire();
        
	},
    handleBubbling : function(component, event, helper) {
		console.log('handler bubble in ---source');
	},
    handleCapture : function(component, event, helper) {
		console.log('handler capture in ---source');
	},
})
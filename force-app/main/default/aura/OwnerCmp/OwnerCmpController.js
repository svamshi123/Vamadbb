({
	handleBubbling : function(component, event, helper) {
		console.log('handler bubble in ---Owner');
	},
    handleCapture : function(component, event, helper) {
		console.log('handler capture in ---Owner');
	},
})
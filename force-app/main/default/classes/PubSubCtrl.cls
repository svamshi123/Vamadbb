public with sharing class PubSubCtrl {
    
    @AuraEnabled
    public static string callPlatformEvent(String recordId,String inputValue){
        try {
            // testEvent__e tevent = new testEvent__e();
            // tevent.recordId__c = recordId;
            // tevent.inputValue__c = inputValue;
            // System.debug('tevent' +tevent);
            // EventBus.publish(tevent);
            Account acc = new Account();
            acc.Id = recordId;
            acc.Total_Amount__c = inputValue;
            update acc;
            return null;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
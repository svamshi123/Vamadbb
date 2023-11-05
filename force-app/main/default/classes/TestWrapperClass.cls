public with sharing class TestWrapperClass {
    
    @AuraEnabled
    public static List<wrapperClass> getRecords() {
        try {
            List<wrapperClass> wrapperClsList = new List<wrapperClass>();
            List<Account> accList = [SELECT Id,Name,CustomerPriority__c FROM Account];
            for (Account acc : accList) {
                wrapperClass wpc = new wrapperClass();
                wpc.Id = acc.Id;
                wpc.name = acc.Name;
                wpc.someField = acc.CustomerPriority__c;
                wrapperClsList.add(wpc);
            }
            return wrapperClsList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    public class wrapperClass {
        @AuraEnabled
        public String Id;
        @AuraEnabled
        public String name;
        @AuraEnabled
        public String someField;
    }
}
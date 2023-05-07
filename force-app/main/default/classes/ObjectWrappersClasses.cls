public with sharing class ObjectWrappersClasses {
    public class grandtFundersWrapperCalss{
        @AuraEnabled
        public String Id;
        @AuraEnabled
        public String colexpenseCategory;
        @AuraEnabled
        public String expenseCategory;
        @AuraEnabled
        public String rowIndex;
        @AuraEnabled
        public String recId;
        @AuraEnabled
        public String totalBudget;
        @AuraEnabled
        public String otherFundingSources;
        @AuraEnabled
        public String requestedFromSentara;
        @AuraEnabled
        public String actualGrantExpenses;
        @AuraEnabled
        public String diff;
        @AuraEnabled
        public String percentage;
        @AuraEnabled
        public String totalcolBudget;
        @AuraEnabled
        public String totalcolotherFundingSources;
        @AuraEnabled
        public String totalcolrequestedFromSentara;
        @AuraEnabled
        public String totalcolactualGrantExpenses;
        @AuraEnabled
        public String totalcoldiff;
        @AuraEnabled
        public String totalcolpercentage;
    }

    public class concatObjWrapper{
        public List<grandtFundersWrapperCalss> objWrapList;
        public Application__c applicationDetails;
        public Decimal totalPercentage = 0.00;
    }

    public class FileInfo {  
        public string docId;   
        public String Title;
        public string Size;
    }
}
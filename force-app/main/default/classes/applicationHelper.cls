public with sharing class applicationHelper {
   public static Boolean updateApplicationRecord(Map<String,Map<String,String>> wrapOnject, String appId){
        Boolean isUpdated = false;
        List<Application__c> applicationList = new List<Application__c>();
        Set<Application__c> applicationSet = new Set<Application__c>();
        Application__c app = new Application__c();
        app.Id = appId;
        for(String key : wrapOnject.keySet()){
            if(key.equals('totalotherDirectExpenses')){
                app.Project_Total_Direct_Expenses__c = Decimal.ValueOf(wrapOnject.get('totalotherDirectExpenses').get('totalcolBudget'));
                app.Project_Total_Direct_Requested__c = Decimal.ValueOf(wrapOnject.get('totalotherDirectExpenses').get('totalcolrequestedFromSentara'));
                app.Project_Total_Direct_Other_Fund_Source__c = Decimal.ValueOf(wrapOnject.get('totalotherDirectExpenses').get('totalcolotherFundingSources'));
                app.Project_Total_Direct_Actual__c = Decimal.ValueOf(wrapOnject.get('totalotherDirectExpenses').get('totalcolactualGrantExpenses'));
                applicationList.add(app);
            }else if(key.equals('totaladministrativeExpenses')){
                app.Project_Total_Administrative_Expenses__c = Decimal.ValueOf(wrapOnject.get('totaladministrativeExpenses').get('totalcolBudget'));
                app.Project_Total_Administrative_Requested__c = Decimal.ValueOf(wrapOnject.get('totaladministrativeExpenses').get('totalcolrequestedFromSentara'));
                app.Project_Total_Administrative_Other_Fund__c = Decimal.ValueOf(wrapOnject.get('totaladministrativeExpenses').get('totalcolotherFundingSources'));
                app.Project_Total_Administrative_Actual__c = Decimal.ValueOf(wrapOnject.get('totaladministrativeExpenses').get('totalcolactualGrantExpenses'));
                applicationList.add(app);
            }else if(key.equals('totalPersonnelExpenses')){
                app.Project_Total_Personnel_Expenses__c = Decimal.ValueOf(wrapOnject.get('totalPersonnelExpenses').get('totalcolBudget'));
                app.Project_Total_Personnel_Requested__c = Decimal.ValueOf(wrapOnject.get('totalPersonnelExpenses').get('totalcolrequestedFromSentara'));
                app.Project_Total_Personnel_Other_Fund_Sourc__c = Decimal.ValueOf(wrapOnject.get('totalPersonnelExpenses').get('totalcolotherFundingSources'));
                app.Project_Total_Personnel_Actual__c = Decimal.ValueOf(wrapOnject.get('totalPersonnelExpenses').get('totalcolactualGrantExpenses'));
                applicationList.add(app);
            }
        }
        applicationSet.addAll(applicationList);
        if(!applicationSet.isEmpty()){
            List<Application__c> appList = new List<Application__c>(applicationSet);
            update appList;
            isUpdated = true;
        }
        return isUpdated;
    }

    public static Application__c getApplicationDetails(String appId){
       return [SELECT Project_Total_Direct_Expenses__c,Project_Total_Direct_Requested__c,
                Project_Total_Direct_Other_Fund_Source__c,Project_Total_Direct_Actual__c,Project_Total_Administrative_Expenses__c,
                Project_Total_Administrative_Requested__c,Project_Total_Administrative_Other_Fund__c,Project_Total_Administrative_Actual__c,
                Project_Total_Personnel_Expenses__c,Project_Total_Personnel_Requested__c,Project_Total_Personnel_Other_Fund_Sourc__c,Project_Total_Personnel_Actual__c
                FROM Application__c WHERE Id =: appId];
    }
}
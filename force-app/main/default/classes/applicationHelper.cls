public with sharing class applicationHelper {
   public static Boolean updateApplicationRecord(Map<String,Map<String,String>> wrapOnject, String appId){
        Boolean isUpdated = false;
        List<Application__c> applicationList = new List<Application__c>();
        Set<Application__c> applicationSet = new Set<Application__c>();
        Application__c app = new Application__c();
        app.Id = appId;
        for(String key : wrapOnject.keySet()){
            if(key.equals('totalotherDirectExpenses')){
                app.Project_Total_Direct_Expenses__c = wrapOnject.get('totalotherDirectExpenses').get('totalcolBudget') != null 
                ? Decimal.ValueOf(wrapOnject.get('totalotherDirectExpenses').get('totalcolBudget')) 
                : 0.00;
                app.Project_Total_Direct_Requested__c = wrapOnject.get('totalotherDirectExpenses').get('totalcolrequestedFromSentara') != null 
                ? Decimal.ValueOf(wrapOnject.get('totalotherDirectExpenses').get('totalcolrequestedFromSentara'))
                : 0.00;
                app.Project_Total_Direct_Other_Fund_Source__c = wrapOnject.get('totalotherDirectExpenses').get('totalcolotherFundingSources') != null 
                ? Decimal.ValueOf(wrapOnject.get('totalotherDirectExpenses').get('totalcolotherFundingSources'))
                : 0.00;
                app.Project_Total_Direct_Actual__c = wrapOnject.get('totalotherDirectExpenses').get('totalcolactualGrantExpenses') != null 
                ? Decimal.ValueOf(wrapOnject.get('totalotherDirectExpenses').get('totalcolactualGrantExpenses'))
                : 0.00;
                applicationList.add(app);
            }else if(key.equals('totaladministrativeExpenses')){
                app.Project_Total_Administrative_Expenses__c = wrapOnject.get('totaladministrativeExpenses').get('totalcolBudget') != null 
                ? Decimal.ValueOf(wrapOnject.get('totaladministrativeExpenses').get('totalcolBudget'))
                : 0.00;
                app.Project_Total_Administrative_Requested__c = wrapOnject.get('totaladministrativeExpenses').get('totalcolrequestedFromSentara') != null 
                ? Decimal.ValueOf(wrapOnject.get('totaladministrativeExpenses').get('totalcolrequestedFromSentara'))
                : 0.00;
                app.Project_Total_Administrative_Other_Fund__c = wrapOnject.get('totaladministrativeExpenses').get('totalcolotherFundingSources') != null 
                ? Decimal.ValueOf(wrapOnject.get('totaladministrativeExpenses').get('totalcolotherFundingSources'))
                : 0.00;
                app.Project_Total_Administrative_Actual__c = wrapOnject.get('totaladministrativeExpenses').get('totalcolactualGrantExpenses') != null
                ? Decimal.ValueOf(wrapOnject.get('totaladministrativeExpenses').get('totalcolactualGrantExpenses'))
                : 0.00;
                applicationList.add(app);
            }else if(key.equals('totalPersonnelExpenses')){
                app.Project_Total_Personnel_Expenses__c = wrapOnject.get('totalPersonnelExpenses').get('totalcolBudget') != null 
                ? Decimal.ValueOf(wrapOnject.get('totalPersonnelExpenses').get('totalcolBudget')) 
                : 0.00;
                app.Project_Total_Personnel_Requested__c = wrapOnject.get('totalPersonnelExpenses').get('totalcolrequestedFromSentara') != null 
                ? Decimal.ValueOf(wrapOnject.get('totalPersonnelExpenses').get('totalcolrequestedFromSentara'))
                : 0.00;
                app.Project_Total_Personnel_Other_Fund_Sourc__c = wrapOnject.get('totalPersonnelExpenses').get('totalcolotherFundingSources') != null 
                ? Decimal.ValueOf(wrapOnject.get('totalPersonnelExpenses').get('totalcolotherFundingSources'))
                :0.00;
                app.Project_Total_Personnel_Actual__c = wrapOnject.get('totalPersonnelExpenses').get('totalcolactualGrantExpenses') != null 
                ? Decimal.ValueOf(wrapOnject.get('totalPersonnelExpenses').get('totalcolactualGrantExpenses'))
                : 0.00;
                applicationList.add(app);
            }else if(key.equals('totalCalBudget')){
                app.Project_Total_Budget__c = wrapOnject.get('totalCalBudget').get('totalallcolBudget') != null 
                ? Decimal.ValueOf(wrapOnject.get('totalCalBudget').get('totalallcolBudget'))
                : 0.00;
                app.Amount_Requested__c = wrapOnject.get('totalCalBudget').get('totalallcolrequestedFromSentara') != null 
                ? Decimal.ValueOf(wrapOnject.get('totalCalBudget').get('totalallcolrequestedFromSentara'))
                : 0.00;
                app.Project_Total_Budget_Other_Fund_Source__c = wrapOnject.get('totalCalBudget').get('totalallcolotherFundingSources') != null 
                ? Decimal.ValueOf(wrapOnject.get('totalCalBudget').get('totalallcolotherFundingSources'))
                : 0.00;
                app.Project_Total_Budget_Actual__c = wrapOnject.get('totalCalBudget').get('totalallcolactualGrantExpenses') != null 
                ? Decimal.ValueOf(wrapOnject.get('totalCalBudget').get('totalallcolactualGrantExpenses'))
                : 0.00;
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
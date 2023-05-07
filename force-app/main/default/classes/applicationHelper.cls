public with sharing class applicationHelper {
   public static void updateApplicationRecord(ObjectWrappersClasses.grandtFundersWrapperCalss wrapOnject, String appId){
        List<Application__c> applicationList = new List<Application__c>();
        Set<Application__c> applicationSet = new Set<Application__c>();
        Application__c app = new Application__c();
        app.Id = appId;
        if(wrapOnject.colexpenseCategory == 'Other Direct Expenses'){
            app.Project_Total_Direct_Expenses__c = Decimal.ValueOf(wrapOnject.totalcolBudget);
            app.Project_Total_Direct_Requested__c = Decimal.ValueOf(wrapOnject.totalcolrequestedFromSentara);
            app.Project_Total_Direct_Other_Fund_Source__c = Decimal.ValueOf(wrapOnject.totalcolotherFundingSources);
            app.Project_Total_Direct_Actual__c = Decimal.ValueOf(wrapOnject.totalcolactualGrantExpenses);
            applicationList.add(app);
        }else if(wrapOnject.colexpenseCategory == 'Administrative Expenses'){
            app.Project_Total_Administrative_Expenses__c = Decimal.ValueOf(wrapOnject.totalcolBudget);
            app.Project_Total_Administrative_Requested__c = Decimal.ValueOf(wrapOnject.totalcolrequestedFromSentara);
            app.Project_Total_Administrative_Other_Fund__c = Decimal.ValueOf(wrapOnject.totalcolotherFundingSources);
            app.Project_Total_Administrative_Actual__c = Decimal.ValueOf(wrapOnject.totalcolactualGrantExpenses);
            applicationList.add(app);
        }else if(wrapOnject.colexpenseCategory == 'Direct - Project Personnel Expenses'){
            app.Project_Total_Personnel_Expenses__c = Decimal.ValueOf(wrapOnject.totalcolBudget);
            app.Project_Total_Personnel_Requested__c = Decimal.ValueOf(wrapOnject.totalcolrequestedFromSentara);
            app.Project_Total_Personnel_Other_Fund_Sourc__c = Decimal.ValueOf(wrapOnject.totalcolotherFundingSources);
            app.Project_Total_Personnel_Actual__c = Decimal.ValueOf(wrapOnject.totalcolactualGrantExpenses);
            applicationList.add(app);
        }
        applicationSet.addAll(applicationList);
        if(!applicationSet.isEmpty()){
            List<Application__c> appList = new List<Application__c>(applicationSet);
            update appList;
        }
    }

    public static Application__c getApplicationDetails(String appId){
        System.debug('appId'+appId);
       return [SELECT Project_Total_Direct_Expenses__c,Project_Total_Direct_Requested__c,
        Project_Total_Direct_Other_Fund_Source__c,Project_Total_Direct_Actual__c,Project_Total_Administrative_Expenses__c,
        Project_Total_Administrative_Requested__c,Project_Total_Administrative_Other_Fund__c,Project_Total_Administrative_Actual__c,
        Project_Total_Personnel_Expenses__c,Project_Total_Personnel_Requested__c,Project_Total_Personnel_Other_Fund_Sourc__c,Project_Total_Personnel_Actual__c
        FROM Application__c WHERE Id =: appId];
    }
}
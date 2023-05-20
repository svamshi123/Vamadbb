public with sharing class ApplicationPdfController {
    public Application__c application { get; set; }
    public String recordId { get; set; }

    public ApplicationPdfController() {
        string appId = System.currentPageReference().getParameters().get('id');
        recordId = appId;
        application = getApplicationDetails(recordId);
    }


    public static Application__c getApplicationDetails(String appId){
        return [SELECT Project_Total_Direct_Expenses__c,Project_Total_Direct_Requested__c,
         Project_Total_Direct_Other_Fund_Source__c,Project_Total_Direct_Actual__c,Project_Total_Administrative_Expenses__c,
         Project_Total_Administrative_Requested__c,Project_Total_Administrative_Other_Fund__c,Project_Total_Administrative_Actual__c,
         Project_Total_Personnel_Expenses__c,Project_Total_Personnel_Requested__c,Project_Total_Personnel_Other_Fund_Sourc__c,
         Project_Total_Personnel_Actual__c, ( SELECT Id,Expense_Category__c,Budget_Line_Item__c,Project_Budget__c,Amount_Applied_from_Sentara_Grant__c,
         Line_funding_source__c,Actual_Amount__c FROM Grant_Budgets__r ), ( SELECT Id,Prior_Year_Fund_Source__c,Funder_Name__c,
         Funding_From__c,Funding_Project_Name__c,Funding_Amount__c,Request_Status__c,Funding_Start_Date__c FROM Other_Funders__r )
         FROM Application__c WHERE Id =: appId];
     }

}
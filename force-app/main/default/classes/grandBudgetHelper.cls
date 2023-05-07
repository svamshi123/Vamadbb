public with sharing class grandBudgetHelper {

    public static ObjectWrappersClasses.concatObjWrapper getDBData(String appId,String expenseCategory){
        Decimal totalPercentage;
        List<ObjectWrappersClasses.grandtFundersWrapperCalss> dgbwList = new List<ObjectWrappersClasses.grandtFundersWrapperCalss>();
        List<Grant_Budget__c> gbList = [SELECT Id,Expense_Category__c,Budget_Line_Item__c,Project_Budget__c,Amount_Applied_from_Sentara_Grant__c,
        Line_funding_source__c,Actual_Amount__c,Application__c,rowIndex__c FROM Grant_Budget__c 
        WHERE Application__c =: appId AND Expense_Category__c =:expenseCategory Order By rowIndex__c ASC];
        if(!gbList.isEmpty()){
            for(Grant_Budget__c gb : gbList){
                ObjectWrappersClasses.grandtFundersWrapperCalss dgbw = new ObjectWrappersClasses.grandtFundersWrapperCalss();
                dgbw.recId = gb.Id;
                dgbw.Id = gb.rowIndex__c;
                dgbw.colexpenseCategory = gb.Expense_Category__c;
                dgbw.expenseCategory = gb.Budget_Line_Item__c;
                dgbw.totalBudget = String.valueOf(gb.Project_Budget__c);
                dgbw.requestedFromSentara = String.valueOf(gb.Amount_Applied_from_Sentara_Grant__c);
                dgbw.otherFundingSources = String.valueOf(gb.Line_funding_source__c);
                dgbw.actualGrantExpenses = String.valueOf(gb.Actual_Amount__c);
                dgbw.rowIndex = gb.rowIndex__c;
                Decimal diffValue;
                if(gb.Project_Budget__c != null && gb.Project_Budget__c != 0){
                    diffValue = gb.Project_Budget__c - gb.Amount_Applied_from_Sentara_Grant__c;
                }
                dgbw.diff = String.ValueOf(diffValue);
                Decimal persentageValue;
                if(gb.Project_Budget__c != null && gb.Project_Budget__c != 0){
                    persentageValue = (gb.Amount_Applied_from_Sentara_Grant__c / gb.Project_Budget__c) * 100;
                }
                if(totalPercentage != null && persentageValue != null){
                    totalPercentage = totalPercentage + persentageValue;
                }
                dgbw.percentage = String.ValueOf((persentageValue));
                dgbwList.add(dgbw);
            }
        }
        Application__c appDetails = applicationHelper.getApplicationDetails(appId);
        ObjectWrappersClasses.concatObjWrapper cow = new ObjectWrappersClasses.concatObjWrapper();
        cow.objWrapList = dgbwList;
        cow.applicationDetails = appDetails;
        cow.totalPercentage = totalPercentage;
        return cow;
    }

    public static List<Grant_Budget__c> getGrandBudgets(String parRecId){

        List<Grant_Budget__c> gbList = [SELECT Id, Status__c FROM Grant_Budget__c 
                                        WHERE Application__c =:parRecId AND Status__c =: 'Draft'];

        return gbList;
    }
}
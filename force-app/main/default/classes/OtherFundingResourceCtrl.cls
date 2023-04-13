public with sharing class OtherFundingResourceCtrl {
    
    @AuraEnabled
    public static string createFundingResource(String resourceData){
        // try {
            Boolean isNoException = false;
            List<ObjectWrapperClass> objectList = (List<ObjectWrapperClass>) JSON.deserialize(resourceData,List<ObjectWrapperClass>.class);
            System.debug('objectList' + objectList);
            List<Grant_Other_Funders__c> otherResourceList = new List<Grant_Other_Funders__c>();
            for(ObjectWrapperClass owc : objectList){
                Grant_Other_Funders__c gor = new Grant_Other_Funders__c();
                gor.Prior_Year_Fund_Source__c = owc.fundingSource;
                if(owc.otherFunders != ''){
                    gor.Funder_Name__c = owc.otherFunders;
                }else{
                    gor.Funder_Name__c = owc.fundingForm;
                }
                gor.Funding_Project_Name__c = owc.nameOftheProj;
                gor.Funding_Amount__c = owc.amountAwarded;
                gor.Request_Status__c = owc.statusOfRequest;
                gor.Funding_Start_Date__c = owc.startDateofFunding;
                otherResourceList.add(gor);
            }
            if(otherResourceList != null && !otherResourceList.isEmpty()){
                insert otherResourceList;
                isNoException = true;
            }
            return isNoException == true ? 'yes it got inserted' : '';
        // } catch (Exception e) {
        //     throw new AuraHandledException(e.getMessage());
        // }
    }
    @AuraEnabled
    public static string createGrnatBudgetRecords(String resourceData,String parRecId,Map<String,String> directMap,Map<String,String> adminMap,Map<String,String> personalMap,
    String otherFundingSrc){
        //  try {
            List<GrandtFundersWrapperCalss> objectList = (List<GrandtFundersWrapperCalss>) JSON.deserialize(resourceData,List<GrandtFundersWrapperCalss>.class);
            List<Grant_Budget__c> grantResourceList = new List<Grant_Budget__c>();
            List<Application__c> applicationList = new List<Application__c>();
            Set<Application__c> applicationSet = new Set<Application__c>();
            for(GrandtFundersWrapperCalss owc : objectList){
                Grant_Budget__c gb = new Grant_Budget__c();
                gb.Expense_Category__c = owc.colexpenseCategory;
                gb.Budget_Line_Item__c = owc.expenseCategory;
                gb.Project_Budget__c = owc.totalBudget;
                gb.Amount_Applied_from_Sentara_Grant__c = owc.requestedFromSentara;
                gb.Line_funding_source__c = owc.otherFundingSources;
                gb.Actual_Amount__c = owc.actualGrantExpenses;
                gb.Application__c = parRecId;
                grantResourceList.add(gb);
            }
            
            if(grantResourceList != null && !grantResourceList.isEmpty()){
                insert grantResourceList;
            }
            if(!directMap.isEmpty() || !adminMap.isEmpty() || !personalMap.isEmpty()){
                Application__c app = new Application__c();
                app.Id = parRecId;

                if(!directMap.isEmpty()){
                    app.Project_Total_Direct_Expenses__c = Decimal.ValueOf(directMap.get('totalcolBudget'));
                    app.Project_Total_Direct_Requested__c = Decimal.ValueOf(directMap.get('totalcolrequestedFromSentara'));
                    app.Project_Total_Direct_Other_Fund_Source__c = Decimal.ValueOf(directMap.get('totalcolotherFundingSources'));
                    app.Project_Total_Direct_Actual__c = Decimal.ValueOf(directMap.get('totalcolactualGrantExpenses'));
                    applicationList.add(app);
                }

                if(!adminMap.isEmpty()){
                    app.Project_Total_Administrative_Expenses__c = Decimal.ValueOf(adminMap.get('totalcolBudget'));
                    app.Project_Total_Administrative_Requested__c = Decimal.ValueOf(adminMap.get('totalcolrequestedFromSentara'));
                    app.Project_Total_Administrative_Other_Fund__c = Decimal.ValueOf(adminMap.get('totalcolotherFundingSources'));
                    app.Project_Total_Administrative_Actual__c = Decimal.ValueOf(adminMap.get('totalcolactualGrantExpenses'));
                    applicationList.add(app);
                }

                if(!personalMap.isEmpty()){
                    app.Project_Total_Personnel_Expenses__c = Decimal.ValueOf(personalMap.get('totalcolBudget'));
                    app.Project_Total_Personnel_Requested__c = Decimal.ValueOf(personalMap.get('totalcolrequestedFromSentara'));
                    app.Project_Total_Personnel_Other_Fund_Sourc__c = Decimal.ValueOf(personalMap.get('totalcolotherFundingSources'));
                    app.Project_Total_Personnel_Actual__c = Decimal.ValueOf(personalMap.get('totalcolactualGrantExpenses'));
                    applicationList.add(app);
                }
                applicationSet.addAll(applicationList);
                if(!applicationSet.isEmpty()){
                    List<Application__c> appList = new List<Application__c>(applicationSet);
                    update appList;
                }
            }
            String returnVal = '';
            if(!String.isBlank(otherFundingSrc)){
                System.debug('otherFundingSrc' +otherFundingSrc);
                returnVal =  OtherFundingResourceCtrl.createFundingResource(otherFundingSrc);
            }

            return returnVal;
        // } catch (Exception e) {
        //     throw new AuraHandledException(e.getMessage());
        // }
    }

    public class ObjectWrapperClass{
        @AuraEnabled
        public Integer Id;
        @AuraEnabled
        public string fundingSource;
        @AuraEnabled
        public string fundingForm;
        @AuraEnabled
        public string otherFunders;
        @AuraEnabled
        public string nameOftheProj;
        @AuraEnabled
        public Decimal amountAwarded;
        @AuraEnabled
        public string statusOfRequest;
        @AuraEnabled
        public Date startDateofFunding;
    }

    public class GrandtFundersWrapperCalss{
        @AuraEnabled
        public String colexpenseCategory;
        @AuraEnabled
        public String expenseCategory;
        @AuraEnabled
        public Decimal totalBudget;
        @AuraEnabled
        public Decimal otherFundingSources;
        @AuraEnabled
        public Decimal requestedFromSentara;
        @AuraEnabled
        public Decimal actualGrantExpenses;
        @AuraEnabled
        public Decimal diff;
        @AuraEnabled
        public Decimal percentage;
    }
}
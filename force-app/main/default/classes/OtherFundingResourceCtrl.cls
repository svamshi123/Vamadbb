public with sharing class OtherFundingResourceCtrl {
    public static String ESIGN_DOCUMENT = 'EsignDisclaimer';  
    @AuraEnabled
    public static string createFundingResource(String resourceData){
        // try {
            Boolean isNoException = false;
            System.debug('resourceData'+resourceData);
            List<ObjectWrapperClass> objectList = (List<ObjectWrapperClass>) JSON.deserialize(resourceData,List<ObjectWrapperClass>.class);
            System.debug('objectList' + objectList);
            List<Grant_Other_Funders__c> otherResourceList = new List<Grant_Other_Funders__c>();
            for(ObjectWrapperClass owc : objectList){
                Grant_Other_Funders__c gor = new Grant_Other_Funders__c();
                gor.Prior_Year_Fund_Source__c = owc.fundingSource;
                if(owc.otherFunders != ''){
                    gor.Funder_Name__c = owc.otherFunders != null ? owc.otherFunders : '';
                }else{
                    gor.Funder_Name__c = owc.fundingForm != null ? owc.fundingForm : '';
                }
                gor.Funding_Project_Name__c = owc.nameOftheProj != null ? owc.nameOftheProj : '';
                gor.Funding_Amount__c = owc.amountAwarded != null ? owc.amountAwarded : 0.00;
                gor.Request_Status__c = owc.statusOfRequest != null ? owc.statusOfRequest : '';
                if(!String.isBlank(owc.startDateofFunding)){
                    gor.Funding_Start_Date__c = Date.valueOf(owc.startDateofFunding);
                }
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

    @AuraEnabled
    public static string getAttchmentDetails(string parId){
        list<FileInfo> fileList = new list<FileInfo>();   
        List<ContentDocumentLink> contentDocList = [SELECT ContentDocumentId, ContentDocument.Title, 
        ContentDocument.LatestPublishedVersionId, ContentDocument.ContentSize, ContentDocument.LatestPublishedVersion.Title, ContentDocument.LatestPublishedVersion.VersionNumber
        FROM ContentDocumentLink
        WHERE LinkedEntityId =: parId];

        for(ContentDocumentLink conlink: contentDocList){
            FileInfo fileData = new FileInfo();
            fileData.docId = conlink.ContentDocumentId;
            fileData.Title = conlink.ContentDocument.Title;           
            fileData.size = FileSizeToString(conlink.ContentDocument.ContentSize);
            fileList.add(fileData);
        }

        String fileJSON = JSON.serialize(fileList);
        return fileJSON;
    }

    public static String FileSizeToString(Long Value){
        if (Value < 1024){
            return string.valueOf(Value) + ' Bytes';
        }else if (Value >= 1024 && Value < (1024*1024)) {
            //KB
            Decimal kb = Decimal.valueOf(Value);
            kb = kb.divide(1024,2);
            return string.valueOf(kb) + ' KB';
        }
        else if (Value >= (1024*1024) && Value < (1024*1024*1024)){
            //MB
            Decimal mb = Decimal.valueOf(Value);
            mb = mb.divide((1024*1024),2);
            return string.valueOf(mb) + ' MB';
        }
        else{
            //GB
            Decimal gb = Decimal.valueOf(Value);
            gb = gb.divide((1024*1024*1024),2);  
            return string.valueOf(gb) + ' GB';
        }    
    }    

    @AuraEnabled
    public static string deleteSingleAttachment(string attchmentID){
        set<id> setIDs = new set<id>();
        List<ContentDocumentLink> contentDocLinkList = [SELECT Id,ContentDocumentId FROM ContentDocumentLink where ContentDocumentId =: attchmentID];
        for(ContentDocumentLink conlink: contentDocLinkList){
            setIDs.add(conlink.ContentDocumentId);
        }
        List<ContentDocument> conDocList = [SELECT Id,IsDeleted,Title,Description FROM ContentDocument WHERE Id IN :setIDs AND IsDeleted = false];
        if(conDocList != null && conDocList.size()>0){
           delete conDocList;
        }
        return conDocList[0].Id;
    }

    @AuraEnabled
    public static Map<String,String> getBodyOfConsent(){
        Map<String,String> result = new Map<String,String>();
        try {
            List<Contentversion> cvList = [SELECT Id, ContentDocumentId,VersionData FROM ContentVersion WHERE Title = :ESIGN_DOCUMENT ORDER BY CreatedDate DESC];
            if(!cvList.isEmpty()){
                result.put('Id',cvList[0].Id);
                result.put('disclaimer',cvList[0].VersionData.toString());
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return result;
    }

    public class FileInfo {  
        public string docId;   
        public String Title;
        public string Size;
    }

    public class ObjectWrapperClass{
        
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
        public String startDateofFunding;
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
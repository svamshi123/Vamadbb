public with sharing class OtherFundingResourceCtrl {
    public static String ESIGN_DOCUMENT = 'EsignDisclaimer';  
    @AuraEnabled
    public static string createFundingResource(String resourceData, String parRecId){
        try {
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
            return isNoException == true ? sendEmail() : '';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static string updateStatusForGBAndOGB(String parRecId){
        try {
            List<Grant_Budget__c> grantResourceList =  grandBudgetHelper.getGrandBudgets(parRecId);
            if(!grantResourceList.isEmpty()){
                for(Grant_Budget__c gb : grantResourceList){
                    gb.Status__c = 'Submitted';
                }
                update grantResourceList;
            }
            return 'Success';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    @AuraEnabled
    public static string getAttchmentDetails(string parId){
        list<ObjectWrappersClasses.FileInfo> fileList = new list<ObjectWrappersClasses.FileInfo>();   
        List<ContentDocumentLink> contentDocList = [SELECT ContentDocumentId, ContentDocument.Title, 
                                                    ContentDocument.LatestPublishedVersionId, ContentDocument.ContentSize, ContentDocument.LatestPublishedVersion.Title, ContentDocument.LatestPublishedVersion.VersionNumber
                                                    FROM ContentDocumentLink
                                                    WHERE LinkedEntityId =: parId];
        
        for(ContentDocumentLink conlink: contentDocList){
            ObjectWrappersClasses.FileInfo fileData = new ObjectWrappersClasses.FileInfo();
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
    
    public static String sendEmail(){
        String rtnStr = '';
        User currentUser = [SELECT Email FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];
        if(currentUser.Email != null){
            List<String> toAddresses = new List<String>{currentUser.Email};
                Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            email.setToAddresses(toAddresses);
            email.setSubject('Application successfully Created');
            email.setPlainTextBody('your Grant Application is submitted please review your application in the portal. Thank you');
            Messaging.SendEmailResult[] results = Messaging.sendEmail(new Messaging.SingleEmailMessage[]{email});
            if (results[0].isSuccess()) {
                rtnStr = 'Success';
            }
        }
        return rtnStr;
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

    @AuraEnabled
    public static Map<String,String> getDataUpsert(String recData,String parRecId,String rowIndex){
        try {
            Map<String,String> recMap = new Map<String,String>();
            List<Grant_Budget__c> grantResourceList = new List<Grant_Budget__c>();
            List<ObjectWrappersClasses.grandtFundersWrapperCalss> objectList = (List<ObjectWrappersClasses.grandtFundersWrapperCalss>) JSON.deserialize(recData,List<ObjectWrappersClasses.grandtFundersWrapperCalss>.class);
            System.debug('objectList'+objectList);
            Integer lastIndex = objectList.size() - 1;
            ObjectWrappersClasses.grandtFundersWrapperCalss  wrapOnject  = objectList[Integer.valueOf(rowIndex)];
            System.debug('wrapOnject'+wrapOnject);
            for(ObjectWrappersClasses.grandtFundersWrapperCalss owc : objectList){
                Grant_Budget__c gb = new Grant_Budget__c();
                if(owc.recId != ''){
                    gb.Id = owc.recId;
                }
                if(owc.recId == ''){
                    gb.Status__c = 'Draft';
                }
                gb.Expense_Category__c = owc.colexpenseCategory;
                gb.Budget_Line_Item__c = owc.expenseCategory;
                gb.Project_Budget__c = owc.totalBudget  != '' ? Decimal.valueOf(owc.totalBudget) : 0.00;
                gb.Amount_Applied_from_Sentara_Grant__c = owc.requestedFromSentara  != '' ? Decimal.valueOf(owc.requestedFromSentara) : 0.00;
                gb.Line_funding_source__c = owc.otherFundingSources != '' ? Decimal.valueOf(owc.otherFundingSources) : 0.00;
                gb.Actual_Amount__c = owc.actualGrantExpenses  != '' ? Decimal.valueOf(owc.actualGrantExpenses) : 0.00;
                gb.Application__c = parRecId;
                gb.rowIndex__c = owc.rowIndex;
                grantResourceList.add(gb);
            }
            upsert grantResourceList;
            System.debug('grantResourceList'+grantResourceList);
            if(wrapOnject!= null){
                applicationHelper.updateApplicationRecord(wrapOnject,parRecId);
            }
            if(!grantResourceList.isEmpty()){
                for(Grant_Budget__c g : grantResourceList){
                    recMap.put(g.rowIndex__c,g.Id);
                }
            }
            return recMap;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static String getAllBudgets(String appId,String expenseCategory){
        try {
            return JSON.serialize(grandBudgetHelper.getDBData(appId,expenseCategory));
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
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
}
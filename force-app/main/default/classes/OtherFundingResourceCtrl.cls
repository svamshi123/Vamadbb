public with sharing class OtherFundingResourceCtrl {
    public static String ESIGN_DOCUMENT = 'EsignDisclaimer';  

    @AuraEnabled
    public static Map<String,String> createOtherFundingResource(String resourceData, String parRecId,String rowIndex){
        try {
            Map<String,String> recMap = new Map<String,String>();
            Map<String,String> fundMap = new Map<String,String>();
            List<Grant_Other_Funders__c> checkFundings = getRecordsWithId(parRecId);
            if(!checkFundings.isEmpty()){
                for(Grant_Other_Funders__c go : checkFundings){
                    recMap.put(go.rowIndex__c,go.Id);
                }
            }
            List<ObjectWrappersClasses.otherGrandtFundersWrapperCalss> objectList = (List<ObjectWrappersClasses.otherGrandtFundersWrapperCalss>) JSON.deserialize(resourceData,List<ObjectWrappersClasses.otherGrandtFundersWrapperCalss>.class);
            List<Grant_Other_Funders__c> otherResourceList = new List<Grant_Other_Funders__c>();
            for(ObjectWrappersClasses.otherGrandtFundersWrapperCalss owc : objectList){
                Grant_Other_Funders__c gor = new Grant_Other_Funders__c();
                gor.Prior_Year_Fund_Source__c = owc.fundingSource;
                if(owc.recId != ''){
                    gor.Id = owc.recId;
                }
                gor.Status__c = 'Draft';
                if(owc.otherFunders != ''){
                    gor.Funder_Name__c = owc.otherFunders != null ? owc.otherFunders : '';
                }else{
                    gor.Funder_Name__c = owc.fundingForm != null ? owc.fundingForm : '';
                }
                gor.Funding_From__c = owc.fundingForm != null ? owc.fundingForm : '';
                gor.Funding_Project_Name__c = owc.nameOftheProj != null ? owc.nameOftheProj : '';
                gor.Funding_Amount__c = owc.amountAwarded != '' ? Decimal.valueOf(owc.amountAwarded) : 0.00;
                gor.Request_Status__c = owc.statusOfRequest != null ? owc.statusOfRequest : '';
                gor.rowIndex__c = owc.rowIndex;
                gor.Application__c = parRecId;
                if(!String.isBlank(owc.startDateofFunding)){
                    gor.Funding_Start_Date__c = Date.valueOf(owc.startDateofFunding);
                }
                otherResourceList.add(gor);
            }
            if(otherResourceList != null && !otherResourceList.isEmpty()){
                upsert otherResourceList;
            }
            if(!otherResourceList.isEmpty()){
                for(Grant_Other_Funders__c go : otherResourceList){
                    recMap.put(go.rowIndex__c,go.Id);
                }
            }
            return recMap;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public static List<Grant_Other_Funders__c> getRecordsWithId(String parRecId){
        return [SELECT Id, rowIndex__c FROM Grant_Other_Funders__c WHERE Application__c =: parRecId];
    }

    @AuraEnabled
    public static List<ObjectWrappersClasses.otherGrandtFundersWrapperCalss>  getOtherFundingResouceRecords(String appId){
        try {
            List<ObjectWrappersClasses.otherGrandtFundersWrapperCalss> ofrList = new List<ObjectWrappersClasses.otherGrandtFundersWrapperCalss>();
            List<Grant_Other_Funders__c> gofList = [SELECT Id,Prior_Year_Fund_Source__c,Funder_Name__c,Funding_Project_Name__c,Funding_Amount__c,Funding_Start_Date__c,
            Funding_From__c,Request_Status__c,rowIndex__c,Status__c,Application__c FROM Grant_Other_Funders__c WHERE Application__c =: appId Order By rowIndex__c ASC];
            for(Grant_Other_Funders__c gof : gofList){
                ObjectWrappersClasses.otherGrandtFundersWrapperCalss gofObj = new ObjectWrappersClasses.otherGrandtFundersWrapperCalss();
                gofObj.recId = gof.Id;
                gofObj.Id = gof.rowIndex__c;
                gofObj.fundingSource = gof.Prior_Year_Fund_Source__c;
                gofObj.disableOtherFunders = gof.Funding_From__c != null && gof.Funding_From__c == 'Others' ? true : false;
                if(gof.Funding_From__c != null && gof.Funding_From__c == 'Others'){
                    gofObj.otherFunders = gof.Funder_Name__c;
                    gofObj.fundingForm = gof.Funding_From__c;
                }else{
                    gofObj.fundingForm = gof.Funding_From__c;
                }
                gofObj.nameOftheProj = gof.Funding_Project_Name__c;
                gofObj.amountAwarded = String.valueOf(gof.Funding_Amount__c);
                gofObj.statusOfRequest = gof.Request_Status__c;
                gofObj.startDateofFunding = String.valueOf(gof.Funding_Start_Date__c);
                gofObj.rowIndex = gof.rowIndex__c;
                ofrList.add(gofObj);
            }
           return ofrList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string updateStatusForGBAndOGB(String parRecId,Boolean fundingResourceCheck,Map<String,Map<String,String>> totalValues){
        try {
            Boolean isUpdated = false;
            if(totalValues != null){
               Boolean isSuccess = applicationHelper.updateApplicationRecord(totalValues,parRecId);
               if(isSuccess){
                    List<Grant_Budget__c> grantResourceList =  grandBudgetHelper.getGrandBudgets(parRecId);
                    if(!grantResourceList.isEmpty()){
                        for(Grant_Budget__c gb : grantResourceList){
                            gb.Status__c = 'Submitted';
                        }
                        update grantResourceList;
                        isUpdated = true;
                    }
                }
            }
            if(!fundingResourceCheck){
                List<Grant_Other_Funders__c> funderResourceList = getFunderResources(parRecId);
                if(!funderResourceList.isEmpty()){
                    for(Grant_Other_Funders__c gb : funderResourceList){
                        gb.Status__c = 'Submitted';
                    }
                    update funderResourceList;
                    isUpdated = true;
                }
            }
            return isUpdated == true ? 'Success' : '';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public static List<Grant_Other_Funders__c>  getFunderResources(String parRecId){
        return [SELECT Id, Status__c FROM Grant_Other_Funders__c WHERE Application__c =: parRecId AND Status__c =: 'Draft'];
    }
   
    @AuraEnabled
    public static Documents__c createDocument(String type, String parId){
        try {
            List<ContentDocumentLink> newContentDocumentToInsert = new List<ContentDocumentLink>();
            List<ContentDocumentLink> docLinkToDelete = new List<ContentDocumentLink>();
            Documents__c doc = createDocuments(type,parId);
            if(doc!=null){
                List<ContentDocumentLink> conDocList = getContentDoc(parId);
                if(conDocList != null && !conDocList.isEmpty()){
                    for(ContentDocumentLink conlink : conDocList){
                        ContentDocumentLink newDocLink = new ContentDocumentLink();
                        newDocLink.LinkedEntityId = doc.Id;
                        newDocLink.ContentDocumentId = conlink.ContentDocumentId;
                        newDocLink.ShareType = 'V';
                        newDocLink.Visibility = 'AllUsers';
                        newContentDocumentToInsert.add(newDocLink);
                        docLinkToDelete.add(conlink);
                    }
                }
                if(newContentDocumentToInsert!=null && !newContentDocumentToInsert.isEmpty()){
                    Database.insert(newContentDocumentToInsert);       
                }   
                if(docLinkToDelete!=null && !docLinkToDelete.isEmpty()){
                    Database.delete(docLinkToDelete);
                }
            }
            return doc;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public static Documents__c createDocuments(String type, String parId){
        Documents__c doc = new Documents__c();
        doc.Application__c = parId;
        doc.Type__c = type;
        if(doc != null){
            insert doc;
        }
        return doc;
    }

    public static List<ContentDocumentLink> getContentDoc(String parId){
        return [SELECT ContentDocumentId, ContentDocument.Title, 
        ContentDocument.LatestPublishedVersionId, ContentDocument.ContentSize, ContentDocument.LatestPublishedVersion.Title, ContentDocument.LatestPublishedVersion.VersionNumber
        FROM ContentDocumentLink
        WHERE LinkedEntityId =: parId];
    }

    @AuraEnabled
    public static String getDocWithType(String type,String appId){
        Map<String,List<ContentDocumentLink>> typeDocMap = new Map<String,List<ContentDocumentLink>>();
        List<Documents__c> docList = [SELECT Id,Type__c,(SELECT Id, ContentDocumentId, ContentDocument.ContentSize,ContentDocument.Title FROM ContentDocumentLinks) 
        FROM Documents__c 
        WHERE Application__c =:appId AND Type__c =: type];
        for(Documents__c doc : docList){
            if(typeDocMap.containsKey(doc.Type__c)){
                typeDocMap.get(doc.Type__c).addALL(doc.ContentDocumentLinks);
            }else{
                typeDocMap.put(doc.Type__c,doc.ContentDocumentLinks);
            }
        }
        List<ObjectWrappersClasses.FileInfo> fileList = getCompressDo(typeDocMap.get(type));
        String fileJSON = JSON.serialize(fileList);
        return fileJSON;
    }

    public static list<ObjectWrappersClasses.FileInfo> getCompressDo(List<ContentDocumentLink> contentDocList){
        list<ObjectWrappersClasses.FileInfo> fileList = new list<ObjectWrappersClasses.FileInfo>();  
        if(contentDocList != null && !contentDocList.isEmpty()){
            for(ContentDocumentLink conlink: contentDocList){
                ObjectWrappersClasses.FileInfo fileData = new ObjectWrappersClasses.FileInfo();
                fileData.docId = conlink.ContentDocumentId;
                fileData.Title = conlink.ContentDocument.Title;           
                fileData.size = FileSizeToString(conlink.ContentDocument.ContentSize);
                fileList.add(fileData);
            }
        } 
        return fileList;
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
        Set<id> setIDs = new Set<id>();
        Set<Id> parSetId = new Set<Id>();
        List<ContentDocumentLink> contentDocLinkList = [SELECT Id,ContentDocumentId, LinkedEntityId FROM ContentDocumentLink where ContentDocumentId =: attchmentID];
        for(ContentDocumentLink conlink: contentDocLinkList){
            setIDs.add(conlink.ContentDocumentId);
            parSetId.add(conlink.LinkedEntityId);
        }
        List<Documents__c> docToDelete = [SELECT Id from Documents__c where ID IN: parSetId];
        if(docToDelete != null){
            delete docToDelete;
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
            for(ObjectWrappersClasses.grandtFundersWrapperCalss owc : objectList){
                if(owc.colexpenseCategory != null || owc.colexpenseCategory != ''){
                    Grant_Budget__c gb = new Grant_Budget__c();
                    if(owc.recId != ''){
                        gb.Id = owc.recId;
                    }
                    gb.Status__c = 'Draft';
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
            }
            upsert grantResourceList;
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

    @AuraEnabled
    public static string deleteRow(String recId,String parId,String colValue){
        try {
            List<Grant_Budget__c> updateGbList = new List<Grant_Budget__c> ();
            if(recId != null){
                Grant_Budget__c gbObject = new Grant_Budget__c(Id = recId);
                delete gbObject;
            }
            List<Grant_Budget__c> gbList =  grandBudgetHelper.getGrandBudgetWithParentId(parId,colValue);
            for (Integer i = 0; i < gbList.size(); i++) {
                gbList[i].rowIndex__c = String.valueOf(i);
            }
            if(!gbList.isEmpty()){
                update gbList;
            }
            return gbList.size() > 0 ? 'Success' : 'Failed';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string deleteOFRRow(String recId,String parId){
        try {
            if(recId != null){
                Grant_Other_Funders__c ofObject = new Grant_Other_Funders__c(Id = recId);
                delete ofObject;
            }
            List<Grant_Other_Funders__c> updateOFList =  getRecordsWithId(parId);
            for (Integer i = 0; i < updateOFList.size(); i++) {
                updateOFList[i].rowIndex__c = String.valueOf(i);
            }
            if(!updateOFList.isEmpty()){
                update updateOFList;
            }
            return updateOFList.size() > 0 ? 'Success' : 'Failed';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
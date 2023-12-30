public with sharing class uploadDoc {
    // @AuraEnabled
    // public static List<ObjectWrapper> getDoc_Cate_PicklistValues() {
    //     List<Schema.PicklistEntry> entries = ContentVersion.Document_Category__c.getDescribe().getPickListValues();
    //     List<ObjectWrapper> docCategoryEntries = new List<ObjectWrapper>();
    //     for (Schema.PicklistEntry entry : entries) {
    //         if (entry.isActive()) {
    //             docCategoryEntries.add(new ObjectWrapper(String.valueOf(entry.getlabel()),String.valueOf(entry.getValue())));
    //         }
    //     }
    //     return docCategoryEntries;
    // }

    // @AuraEnabled
    // public static List<ObjectWrapper> getDoc_SUb_Cate_PicklistValues() {
    //     List<Schema.PicklistEntry> entries = ContentVersion.Document_SubCategory__c.getDescribe().getPickListValues();
    //     List<ObjectWrapper> docSubCategoryEntries = new List<ObjectWrapper>();
    //     for (Schema.PicklistEntry entry : entries) {
    //         if (entry.isActive()) {
    //             docSubCategoryEntries.add(new ObjectWrapper(String.valueOf(entry.getlabel()),String.valueOf(entry.getValue())));
    //         }
    //     }
    //     return docSubCategoryEntries;
    // }
    @AuraEnabled
    public static string fetchAccountId(String recId){
        try {
            List<Contact> conList =  [SELECT Id,AccountId FROM Contact WHERE Id=: recId];
            return conList[0].AccountId;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<ContentDocumentLink> createFile(String objString,String parentRecord){
        try {
            List<ObjectContentVersionWrapper> objectList = (List<ObjectContentVersionWrapper>) JSON.deserialize(objString,List<ObjectContentVersionWrapper>.class);
            List<ContentVersion> createConVerList = new List<ContentVersion>();
            List<ContentDocumentLink> createContentDocumentLinkList = new List<ContentDocumentLink>();
            System.debug('objectList'+objectList);
            for(ObjectContentVersionWrapper conVerInfo : objectList){
                ContentVersion aContentVersion = new ContentVersion();
                aContentVersion.PathOnClient = conVerInfo.fileTitle;
                aContentVersion.Title = conVerInfo.fileTitle;
                aContentVersion.VersionData = conVerInfo.fileData;
                aContentVersion.Document_Category__c = conVerInfo.docCategory;
                aContentVersion.Document_SubCategory__c = conVerInfo.docSubCategory;
                createConVerList.add(aContentVersion);
            }
            System.debug('createConVerList before'+createConVerList);
        //    insert createConVerList;
        //     System.debug('createConVerList after'+createConVerList);
        //     List<ContentVersion> insertedContentVersion = [
        //         SELECT Id,ContentDocumentId
        //         FROM ContentVersion
        //         WHERE Id IN :createConVerList
        //     ];
        //     System.debug('ContentDocumentId '+createConVerList);
        //      Map<Id,Id> conVerwithConTDocIdMap = new Map<Id,Id>();
        //     for(ContentVersion conVer : insertedContentVersion){
        //         conVerwithConTDocIdMap.put(conVer.Id,conVer.ContentDocumentId);
        //     }

        //     for(ContentVersion conObject : insertedContentVersion){
        //         ContentDocumentLink aContentDocumentLink = new ContentDocumentLink();
        //         aContentDocumentLink.ContentDocumentId = conVerwithConTDocIdMap.get(conObject.Id);
        //         aContentDocumentLink.LinkedEntityId = parentRecord;
        //         createContentDocumentLinkList.add(aContentDocumentLink);
        //     }
        //     insert createContentDocumentLinkList;
            return createContentDocumentLinkList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    // @AuraEnabled
    // public static string UpdatetheContentVersion(String objString,String parentRecord){
    //     try {
    //         List<ObjectWrapper> objectList = (List<ObjectWrapper>) JSON.deserialize(objString,List<ObjectWrapper>.class);
    //         List<ContentVersion> updateConVerList = new List<ContentVersion>();
    //         for(ObjectWrapper str : objectList){
    //             ContentVersion conver = new ContentVersion();
    //             conver.Id = (Id)str.contentVersionId;
    //             conver.Document_Category__c = str.docCatagory;
    //             conver.Document_SubCategory__c = str.docSubCatagory;
    //             updateConVerList.add(conver);
    //         }
    //         update updateConVerList;
    //         return 'success';
    //     } catch (Exception e) {
    //         throw new AuraHandledException(e.getMessage());
    //     }
    // }
    @AuraEnabled
    public static String getDocuments(String accId){
        Map<String,List<ContentDocumentLink>> typeDocMap = new Map<String,List<ContentDocumentLink>>();
        List<ContentDocumentLink> docList = getContentDoc(accId);
        List<FileInfo> fileList = getCompressDo(docList);
        String fileJSON = JSON.serialize(fileList);
        return fileJSON;
    }

    public static list<FileInfo> getCompressDo(List<ContentDocumentLink> contentDocList){
        list<FileInfo> fileList = new list<FileInfo>();  
        if(contentDocList != null && !contentDocList.isEmpty()){
            for(ContentDocumentLink conlink: contentDocList){
                FileInfo fileData = new FileInfo();
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
    // @AuraEnabled
    // public static void UpdatetheContentVersion(Map<String,String> objectMap,String parentRecord){
    //     try {
    //         List<ContentDocumentLink> conDocList = getContentDoc(parentRecord);
    //         Set<Id> contentDocId = new Set<Id>();
    //         for(ContentDocumentLink conId : conDocList){
    //             contentDocId.add(conId.ContentDocumentId);
    //         }
    //         Map<Id,Id> conVerWithConDocId = new Map<Id,Id>();
    //         List<ContentVersion> conVerList = [SELECT Id, Document_Category__c,Document_SubCategory__c,ContentDocumentId
    //                                             FROM ContentVersion 
    //                                             WHERE ContentDocumentId IN: contentDocId];
    //          for(ContentVersion conVerId : conVerList){
    //             conVerWithConDocId.put(conVerId.ContentDocumentId,conVerId.Id);
    //          }
    //          List<ContentVersion> updateConVerList = new List<ContentVersion>();
    //          for(ContentVersion conVerId : conVerList){
    //             if(objectMap.containsKey(conVerId.ContentDocumentId)){
    //                 ContentVersion conver = new ContentVersion();
    //                 conver.Id = conVerWithConDocId.get(objectMap.get(conVerId.ContentDocumentId));
    //                 conver.Document_Category__c = objectMap.get('docCatagory');
    //                 conver.Document_SubCategory__c = objectMap.get('docSubCatagory');
    //                 updateConVerList.add(conver);
    //             }
    //         }
    //         update updateConVerList;
    //     } catch (Exception e) {
    //         throw new AuraHandledException(e.getMessage());
    //     }
    // }

    public static List<ContentDocumentLink> getContentDoc(String parId){
        return [SELECT ContentDocumentId, ContentDocument.Title, ContentDocument.ContentSize 
        FROM ContentDocumentLink
        WHERE LinkedEntityId =: parId];
    }
    public class ObjectWrapper{
        @AuraEnabled
        public string contentVersionId;
        @AuraEnabled
        public string docSubCatagory;
        @AuraEnabled
        public string docCatagory;
    }
    public class FileInfo {  
        @AuraEnabled
        public string docId;  
        @AuraEnabled 
        public String Title;
        @AuraEnabled
        public string Size;
    }

    public class ObjectContentVersionWrapper{
        @AuraEnabled
        public string fileTitle;
        @AuraEnabled
        public Blob fileData;
        @AuraEnabled
        public string docSubCategory;
        @AuraEnabled
        public string docCategory;
    }
}
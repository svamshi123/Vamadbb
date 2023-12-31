public with sharing class uploadDoc {

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
            // insert createConVerList;
            // System.debug('createConVerList after'+createConVerList);
            // List<ContentVersion> insertedContentVersion = [
            //     SELECT Id,ContentDocumentId
            //     FROM ContentVersion
            //     WHERE Id IN :createConVerList
            // ];
            // System.debug('ContentDocumentId '+createConVerList);
            // Map<Id,Id> conVerwithConTDocIdMap = new Map<Id,Id>();
            // for(ContentVersion conVer : insertedContentVersion){
            //     conVerwithConTDocIdMap.put(conVer.Id,conVer.ContentDocumentId);
            // }

            // for(ContentVersion conObject : insertedContentVersion){
            //     ContentDocumentLink aContentDocumentLink = new ContentDocumentLink();
            //     aContentDocumentLink.ContentDocumentId = conVerwithConTDocIdMap.get(conObject.Id);
            //     aContentDocumentLink.LinkedEntityId = parentRecord;
            //     createContentDocumentLinkList.add(aContentDocumentLink);
            // }
            // insert createContentDocumentLinkList;
            return createContentDocumentLinkList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
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
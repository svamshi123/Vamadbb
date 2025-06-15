public with sharing class MetadataController {
    public Static String garageName = 'Sri Laxmi Honda Showroom';
    @AuraEnabled(Cacheable=true)
    public static string fetchMetadataRecords(){
        try {
            List<ParentMetaDataWrapper> parentMetadataList = new List<ParentMetaDataWrapper>();
            List<Test_Parent__mdt> metadataRecordList = [SELECT Id,MasterLabel,Parent_Description__c,Garage_Name__c,Default_Service__c,
            (SELECT Id, MasterLabel, Test_Child_Description__c,Garage_Name__c FROM Test_childern__r) FROM Test_Parent__mdt];
            Map<String,String> idByName = new Map<String,String>();
            for( Test_Parent__mdt parentMetaRec : metadataRecordList){
                idByName.put(parentMetaRec.id,parentMetaRec.Garage_Name__c);
            }
            for(Test_Parent__mdt parentMetaRec : metadataRecordList) {
                ParentMetaDataWrapper parentWrapper = new ParentMetaDataWrapper();
                if(parentMetaRec.Garage_Name__c != null && parentMetaRec.Garage_Name__c.contains(garageName)){
                    parentWrapper.parentMetaRecId = parentMetaRec.Id;
                    parentWrapper.parentMetaLabel = parentMetaRec.MasterLabel;
                    parentWrapper.parentMetaDesc = parentMetaRec.Parent_Description__c;
                    parentWrapper.parentMetaDefaultService = parentMetaRec.Default_Service__c;
                    // parentWrapper.showParentAddIcon = parentMetaRec.Default_Service__c ? false : true;
                    // parentWrapper.showParentRemoveIcon = parentMetaRec.Default_Service__c ? true : false;
                    List<ChildMetaDataWrapper> childMetaDataList = new List<ChildMetaDataWrapper>();
                    for(Test_Child__mdt childMetaRec : parentMetaRec.Test_childern__r) {
                        ChildMetaDataWrapper childWrapper = new ChildMetaDataWrapper();
                        if(childMetaRec.Garage_Name__c != null && childMetaRec.Garage_Name__c.contains(garageName)){
                            childWrapper.childMetaRecId = childMetaRec.Id;
                            childWrapper.childParentMetaRecId =  parentMetaRec.Id;
                            childWrapper.childMetaLabel = childMetaRec.MasterLabel;
                            childWrapper.childMetaDesc = childMetaRec.Test_Child_Description__c;
                            childMetaDataList.add(childWrapper);
                        }
                    }
                    parentWrapper.childMetaDataList = childMetaDataList;
                    parentMetadataList.add(parentWrapper);
                }
            }

            return JSON.serialize(parentMetadataList);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class ParentMetaDataWrapper {
        @AuraEnabled
        public String parentMetaRecId;
        @AuraEnabled
        public String parentMetaLabel;
        @AuraEnabled
        public String parentMetaDesc;
        @AuraEnabled
        public Boolean showParentAddIcon = true;
        @AuraEnabled
        public Boolean showParentRemoveIcon = false;
        @AuraEnabled
        public Boolean parentMetaDefaultService = false;
        @AuraEnabled
        public List<ChildMetaDataWrapper> childMetaDataList;
    }

    public class ChildMetaDataWrapper {
        @AuraEnabled
        public String childMetaRecId;
        @AuraEnabled
        public String childParentMetaRecId;
        @AuraEnabled
        public String childMetaLabel;
        @AuraEnabled
        public String childMetaDesc;
        @AuraEnabled
        public Boolean showChildAddIcon = true;
        @AuraEnabled
        public Boolean showChildRemoveIcon = false;
    }
}
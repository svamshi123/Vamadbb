public with sharing class CustomRelatedListViewCtrl {

    @AuraEnabled
    public static Map<String, String> getLabelWithAPI(List<String> selectedFields,String nameObject){
        Map<String, String> fieldeMap = new Map<String, String>();
        for(String field : selectedFields){
            fieldeMap.put(field, Schema.getGlobalDescribe().get(nameObject).getDescribe().fields.getMap().get(field).getDescribe().getLabel());
        }
        return fieldeMap;
    }
    @AuraEnabled
    public static Map<String, String> getFieldTypes(List<String> selectedFields,String nameObject){
        Map<String, String> fieldTypeMap = new Map<String, String>();
        for(String field : selectedFields){
            Schema.DisplayType fieldType = Schema.getGlobalDescribe().get(nameObject).getDescribe().fields.getMap().get(field).getDescribe().getType();
            fieldTypeMap.put(field, String.valueOf(fieldType));
        }
        return fieldTypeMap;
    }

    @AuraEnabled
    public static List<SObject> getRecords(String childObjAPIName,String parentObjAPIName,String parRecId,String fields){
        List<SObject> sobjectList = new List<SObject>();
        try{
            String query = 'SELECT Id,'+ fields + ' FROM '+ childObjAPIName + ' WHERE ' + parentObjAPIName +'= :parRecId';
            sobjectList =  Database.query(query);
        }catch(Exception ex){
            System.debug('Message => '+ ex.getMessage());        
        }
        return sobjectList;
    }
}
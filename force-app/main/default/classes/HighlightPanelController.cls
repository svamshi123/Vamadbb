public with sharing class HighlightPanelController {
    @AuraEnabled
    public static ReturnWP fetchFields(String recordId, String objectName, String fieldSetName) {
        ReturnWP res = new ReturnWP();
        try {
            // Querying Name Field
            if(String.isBlank(recordId)) {
                res.message = 'Invalid Id';
                return res;
            }
            List<sObject> objectList = Database.query('SELECT id, Name FROM ' + objectName + ' WHERE Id =: recordId');
            res.nameField = String.valueof(objectList[0].get('Name'));

            // Fetching Highlight Panel Field Set
            if(String.isBlank(fieldSetName)) {
                res.message = 'Please provide a Field Set Name';
                return res;
            }
            res.objectLabel = (String)Schema.getGlobalDescribe().get(objectName).getDescribe().getLabel();
            Schema.FieldSet fieldSet = Schema.getGlobalDescribe().get(objectName).getDescribe().fieldSets.getMap().get(fieldSetName);
            if(fieldSet == null) {
                res.message = 'Field Set provided is not Valid';
                return res;
            }
            res.fieldsAPI = new List<String>();
            for(Schema.FieldSetMember fieldSetMem:fieldSet.getFields()){
                System.debug(fieldSetMem);
                res.fieldsAPI.add(fieldSetMem.getFieldPath());
            }
            res.icoName = getIconName(objectName);
            return res;
        } catch(Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }

    public static String getIconName(String sObjectName){
        String u;
        List<Schema.DescribeTabSetResult> tabSetDesc = Schema.describeTabs();
        List<Schema.DescribeTabResult> tabDesc = new List<Schema.DescribeTabResult>();
        List<Schema.DescribeIconResult> iconDesc = new List<Schema.DescribeIconResult>();

        for(Schema.DescribeTabSetResult tsr : tabSetDesc) { tabDesc.addAll(tsr.getTabs()); }

        for(Schema.DescribeTabResult tr : tabDesc) {
            if( sObjectName == tr.getSobjectName() ) {
                if( tr.isCustom() == true ) {
                    iconDesc.addAll(tr.getIcons());
                } else {
                    u = 'standard:' + sObjectName.toLowerCase();
                }
            }
        }
        for (Schema.DescribeIconResult ir : iconDesc) {
            if (ir.getContentType() == 'image/svg+xml'){
                u = 'custom:' + ir.getUrl().substringBetween('custom/','.svg').substringBefore('_');
                break;
            }
        }
        return u;
    }

    public class ReturnWP {
        @AuraEnabled public String message;
        @AuraEnabled public String nameField;
        @AuraEnabled public String objectLabel; 
        @AuraEnabled public String icoName; 
        @AuraEnabled public List<String> fieldsAPI;
    }
}
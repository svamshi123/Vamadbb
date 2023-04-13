public class RecordController {
	@AuraEnabled
    public static void getObject(String recordId,String objectType,List<String> fields){
        System.debug('fields'+fields);
    }
}
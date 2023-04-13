public class ObjectAClass {
	@AuraEnabled(cacheable = true)
    public static List<ObjectA__c> getRecord(String num,String alp,String word){
		List<ObjectA__c> oblist = [select Id,Name,Numbers__c,Alphabet__c,Words__c from ObjectA__c where Numbers__c =:num AND Alphabet__c =:alp
                                  AND Words__c =:word];
        System.debug('oblist'+oblist);
        return oblist;
    }
}
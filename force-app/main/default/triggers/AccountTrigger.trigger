trigger AccountTrigger on Account (after insert,after update,before update) {
    for(Account acc : trigger.new){
        //FutureTaskCreater.createTask(acc.id);
        Queueabletaskcreater qu = new Queueabletaskcreater(acc.Id);
        //id jobId = System.enqueueJob(qu);
    }
    if (trigger.isBefore && trigger.isUpdate){
        List<Account> accountsToUpdate = new List<Account>();
        for (Account acc : Trigger.new) {
            if (acc.propper_message__c != Trigger.oldMap.get(acc.Id).propper_message__c && acc.propper_message__c != null
            && Trigger.oldMap.get(acc.Id).propper_message_date__c != null) {
                Date thirtyDaysAgo = Date.today().addDays(1);
                if (Trigger.oldMap.get(acc.Id).propper_message_date__c < thirtyDaysAgo) {
                    acc.propper_message__c = null;
                }
            }
            if(Trigger.oldMap.get(acc.Id).propper_message__c == null && Trigger.oldMap.get(acc.Id).propper_message_date__c == null){
                acc.propper_message_date__c = Date.today();
            }
        }
    } 
}
public class AccountFieldCleanup implements Schedulable {
    public void execute(SchedulableContext context) {
        List<Account> accountsToUpdate = [SELECT Id, propper_message__c FROM Account WHERE propper_message__c != null AND propper_message_date__c < :Date.today().addDays(1)];
        for (Account acc : accountsToUpdate) {
            acc.propper_message__c = null;
        }
        update accountsToUpdate;
    }
}

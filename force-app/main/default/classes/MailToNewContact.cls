global class MailToNewContact implements Database.Batchable<sObject> {
    Map<Id,Contact> newConMap = new Map<id,Contact>();
    public MailToNewContact(Map<Id,Contact> conMap){
        this.newConMap = conMap;
    }
    global Database.QueryLocator start(Database.BatchableContext bx){
        System.debug('newConMap'+newConMap);
        return Database.getQueryLocator([select id,Email from contact where id in: newConMap.keySet()]);
    }
    global void execute(Database.BatchableContext bx, List<contact> conobject){
        System.debug('conobject'+conobject);
        for(contact con: conobject){
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            email.setToAddresses(new String[]{con.email});
            email.setSubject('Welcome to Salesforce');
            email.setPlainTextBody('Thanks for using the salesforce');
            Messaging.sendEmail(new Messaging.SingleEmailMessage[]{email});
        }
    }
     global void finish(Database.BatchableContext bx){
        
    }
}
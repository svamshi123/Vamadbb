trigger AccountDelete on Account (before delete) {
   Set<Id> acIDs = new Set<Id>();
    for(Account acc: trigger.old){
        acIDs.add(acc.id);
    }
    List<Account> accList = [select id,(select id from contacts) from Account where Id=:acIDs];
    Map<Id,Account> accMap = new Map<Id,Account>();
    for(Account acc : accList){
        accMap.put(acc.id,acc);
    }
    for(Account acc : trigger.old){
        if(accMap.get(acc.id).contacts.size() >= 2){
            acc.adderror('account can not be deleted');
        }
    }
}
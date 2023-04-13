public class lwcCustomLookupController {
    @AuraEnabled(cacheable=true)
    public static List<SObJectResult> getResults(String ObjectName, String fieldName, String value) {
        List<SObJectResult> sObjectResultList = new List<SObJectResult>();
        system.debug(fieldName+'-------------'+ObjectName+'---++----------'+value);
        if(String.isNotEmpty(value))
            for(sObject so : Database.Query('Select Id,'+fieldName+' FROM '+ObjectName+' WHERE '+fieldName+' LIKE \'%' + value + '%\'')) {
                String fieldvalue = (String)so.get(fieldName);
                sObjectResultList.add(new SObjectResult(fieldvalue, so.Id));
            }
        
        return sObjectResultList;
    }
    @AuraEnabled
    public static void createEventRecord(String subject,Datetime startdate, Datetime enddate, String con,String acc,String user,String location){
        System.debug('startdate'+startdate+'enddate'+enddate);
       
        Event ev = new Event();
        ev.Subject = subject;
        ev.StartDateTime=  startdate;
        ev.EndDateTime = enddate;
        ev.WhoId = con;
        ev.WhatId = acc;
        ev.OwnerId = user;
        ev.Location = location;
        
        insert ev;
    }
    public class SObJectResult {
        @AuraEnabled
        public String recName;
        @AuraEnabled
        public Id recId;
        
        public SObJectResult(String recNameTemp, Id recIdTemp) {
            recName = recNameTemp;
            recId = recIdTemp;
        }
    }
}
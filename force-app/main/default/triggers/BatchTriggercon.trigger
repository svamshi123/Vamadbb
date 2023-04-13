trigger BatchTriggercon on Contact (after insert) {
	Map<Id,contact> newmap = new Map<id,contact>();
    for(contact con: trigger.new){
        if(con.id != null){
            newmap.put(con.id,con);
        }
    }
    if(newmap.size() > 0){
        database.executeBatch(new MailToNewContact(newmap));
    }
}
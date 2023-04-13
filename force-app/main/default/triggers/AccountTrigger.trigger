trigger AccountTrigger on Account (after insert,after update) {
    for(Account acc : trigger.new){
        FutureTaskCreater.createTask(acc.id);
        Queueabletaskcreater qu = new Queueabletaskcreater(acc.Id);
        id jobId = System.enqueueJob(qu);
    }
    

}
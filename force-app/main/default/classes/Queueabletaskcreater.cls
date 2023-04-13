public class Queueabletaskcreater implements Queueable{
    private String recId;
    public Queueabletaskcreater(String recId){
        this.recId = recId;
    }
    public void execute(QueueableContext qx){
        Task ts = new Task();
        ts.Subject = 'creating form Queueable';
        ts.WhatId = recId;
        insert ts;
    }
}
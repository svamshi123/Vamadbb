public class FutureTaskCreater {
   
    @future(callout = true)
    public static void createTask(String recId){
        Task ts = new Task();
        ts.Subject = 'creating form future';
        ts.WhatId = recId;
        insert ts;
    }

}
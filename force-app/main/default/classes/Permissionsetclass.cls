public class Permissionsetclass {
    @auraEnabled
    Public Static String getObjectAccess(){
        String permission = '-';
        
        Schema.DescribeFieldResult objSchema = Student__c.Roll_Number__c.getDescribe();
        
        if(objSchema.isCreateable()){
            permission+='C';
        }
        if(objSchema.isAccessible()){
            permission+='R';
        }
        if(objSchema.isUpdateable()){
            permission+='U';
        }
        return permission;
    }
}
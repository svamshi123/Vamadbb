@RestResource(urlMapping='/v1/GetResponseFromSource/*')
global class GetResponseFromSource {
    @Httppost
    global static String savelead(){
        ID accId;
        ID conId;
        List<Product_Complaint__c> PCList = new List<Product_Complaint__c>();
        String reqBody;
        RestRequest req = RestContext.request;
        reqBody = RestContext.request.requestBody.toString();
        ProductfromUI jsonstrulist = (ProductfromUI) System.JSON.deserialize(reqBody, ProductfromUI.class);
        system.debug('jsonstrulist==========>'+jsonstrulist);
        Accountclass accclass = (Accountclass)System.JSON.deserialize(jsonstrulist.ProductAccount,Accountclass.class);
        Contactclass conclass = (Contactclass)System.JSON.deserialize(jsonstrulist.ProductContact,Contactclass.class);
        FileDatawrap fileclass = (FileDatawrap)System.JSON.deserialize(jsonstrulist.attachment,FileDatawrap.class);
        System.debug('fileclass'+fileclass);
        List<Account> selectAccount = [select Id,name from Account];
        List<Contact> selectContact = [select Id,FirstName,LastName from Contact];
        for(Account a :selectAccount){
            if(a.Name == accclass.Name){
				accId = a.Id;                
            }
        }
        for(Contact c :selectContact){
            if(c.FirstName == conclass.FirstName && c.LastName == conclass.LastName){
				conId = c.Id;                
            }
        }
        Account acc;
        if(accId == null){
            acc = new Account();
            acc.Name = accclass.Name;
            insert acc;
        }
        Contact con;
        if(conId == null){
            con = new Contact();
            con.FirstName = conclass.FirstName;
            con.LastName = 	conclass.LastName;
            con.AccountId = acc.Id;
            insert con;
        }
        Product_Complaint__c produ = new Product_Complaint__c();
        if(accId != null){
             produ.ProductAccount__c = accId;
        }else{
           	 produ.ProductAccount__c = acc.Id;
        }
        if(conId != null){
             produ.ProductContact__c = conId;
        }else{
           	 produ.ProductContact__c = con.Id;
        }
       	produ.Country__c = jsonstrulist.Country;
        produ.Credit_Required__c = jsonstrulist.Credit_Required;
        produ.If_Written_Reply_is_Required__c = jsonstrulist.If_Written_Reply_is_Required;
        produ.Is_Sample_being_returned__c = jsonstrulist.Is_Sample_being_returned;
        produ.Patient_Outcome__c = jsonstrulist.Patient_Outcome;
        produ.PC_Method_of_Contact__c = jsonstrulist.PC_Method_of_Contact;
        produ.Was_a_photograph_or_drawing_Provided__c = jsonstrulist.Was_a_photograph_or_drawing_Provided;
        produ.Was_there_any_patient_involvement__c = jsonstrulist.Was_there_any_patient_involvement;
        produ.When_did_this_occur__c = jsonstrulist.When_did_this_occur;
        PCList.add(produ);
        System.debug('produ'+produ);
        try{
            insert PCList;
            
            fileclass.base64Data = EncodingUtil.urlDecode(fileclass.base64Data, 'UTF-8');
            Attachment oAttachment = new Attachment();
            oAttachment.parentId = produ.ID;
            oAttachment.Body = EncodingUtil.base64Decode(fileclass.base64Data);
            oAttachment.Name = fileclass.fileName;
            oAttachment.ContentType = fileclass.contentType;
            
            insert oAttachment;
            
            return 'Record Inserted';
        }catch(Exception e){
            return e.getMessage();
        }
    }
     public class ProductfromUI{
        public String Country;
        public String ProductAccount;
        public String ProductContact;
        public String If_Written_Reply_is_Required;
        public String Is_Sample_being_returned;
        public String Patient_Outcome;
        public String PC_Method_of_Contact;
        public String Was_a_photograph_or_drawing_Provided;
        public String Was_there_any_patient_involvement;
        public String Credit_Required;
        public String When_did_this_occur;
        public String attachment;
	}
    public class Accountclass{
        public String Name;
    }
    public class Contactclass{
        public String FirstName;
        public String LastName;
    }
    public class FileDatawrap{
        public String fileName;
        public String base64Data;
        public String contentType;
    }
}
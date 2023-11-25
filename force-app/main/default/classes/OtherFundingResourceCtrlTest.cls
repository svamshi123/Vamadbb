@isTest
public class OtherFundingResourceCtrlTest {
    public static final String userName = 'test.portal@example.com';
    @TestSetup
    public static void setup() {
        User externalUser = TestDataFactory.getGuestUser();
        externalUser.LastName = 'testUserExternal';
        update externalUser;
        System.runAs(externalUser){
            Account site = TestDataFactory.getSiteAccount();
            
            Contact newContact = TestDataFactory.getContact('Bob', 'Tester');
            newContact.AccountId = site.Id;
            newContact.Email = 'testuser@test.com';
            insert newContact;
            
            Test.startTest();
            String ProfileName = 'Customer Community Login User';
            TestDataFactory.getPortalUser(ProfileName, userName, newContact.Id);
            Test.stopTest();
            
            User PortalUser = [SELECT Id,UserName from User where UserName = : userName];
            System.assertEquals(PortalUser.UserName, userName);
            
            Application__c app = new Application__c();
            app.Account__c = site.Id;
            insert app;
            
            Grant_Other_Funders__c gof = new Grant_Other_Funders__c();
            gof.Application__c = app.Id;
            gof.Funding_From__c = 'Sentara Corporate';
            gof.Status__c = 'Draft';
            gof.Funding_Project_Name__c = 'Test';
            gof.Prior_Year_Fund_Source__c = 'Sentara Artifacts';
            gof.Funder_Name__c = 'Test';
            gof.Funding_Amount__c = 50.00;
            gof.Request_Status__c = 'Submitted';
            insert gof;
            
            Grant_Other_Funders__c gofa = new Grant_Other_Funders__c();
            gofa.Application__c = app.Id;
            gofa.Funding_From__c = 'Sentara Corporate';
            gofa.Status__c = 'Draft';
            gofa.Funding_Project_Name__c = 'Test';
            gofa.Prior_Year_Fund_Source__c = 'Sentara Artifacts';
            gofa.Funder_Name__c = 'Test';
            gofa.Funding_Amount__c = 50.00;
            gofa.Request_Status__c = 'Pending';
            insert gofa;
            
            Grant_Budget__c gb = new Grant_Budget__c();
            gb.Application__c = app.Id;
            gb.Status__c = 'Draft';
            gb.Expense_Category__c = 'Direct - Project Personnel Expenses';
            insert gb;
            
        }
    }
    @isTest
    public static void createOtherFundingResourceTest(){
        Application__c app = [SELECT Id FROM Application__c LIMIT 1];
        List<ObjectWrappersClasses.otherGrandtFundersWrapperCalss> objectList = new List<ObjectWrappersClasses.otherGrandtFundersWrapperCalss>();
        ObjectWrappersClasses.otherGrandtFundersWrapperCalss wrapObject = new ObjectWrappersClasses.otherGrandtFundersWrapperCalss();
        Test.startTest();
        wrapObject.amountAwarded = '50.00';
        wrapObject.disableOtherFunders = true;
        wrapObject.fundingForm = 'Sentara Corporate';
        wrapObject.otherFunders = 'Sentara Corporate';
        wrapObject.fundingSource = 'Sentara Artifacts';
        wrapObject.isOtherFunderForm = true;
        wrapObject.nameOftheProj = 'Test';
        wrapObject.rowIndex = '0';
        objectList.add(wrapObject);
        Map<String,String> retMap = OtherFundingResourceCtrl.createOtherFundingResource(JSON.serialize(objectList),app.Id,'0');
        List<ObjectWrappersClasses.otherGrandtFundersWrapperCalss> reList = OtherFundingResourceCtrl.getOtherFundingResouceRecords(app.Id);
        Test.stopTest();
    }
    @isTest
    public static void createDocumentTest(){
        Application__c app = [SELECT Id FROM Application__c LIMIT 1];
        User userDetail = [SELECT Id from User WHERE LastName = 'testUserExternal'];
        System.runAs(userDetail){
            Test.startTest();
            ContentVersion content=new ContentVersion(); 
            content.Title='Header_Picture1'; 
            content.PathOnClient='/' + content.Title + '.jpg'; 
            Blob bodyBlob=Blob.valueOf('Unit Test ContentVersion Body'); 
            content.VersionData=bodyBlob; 
            insert content;
            Id contentDocId = [select contentdocumentId from contentversion where Id =: content.Id].contentdocumentId;
            ContentDocumentLink contentlink=new ContentDocumentLink();
            contentlink.LinkedEntityId=app.Id;
            contentlink.contentdocumentId=contentDocId;
            contentlink.ShareType = 'I';
            contentlink.Visibility = 'AllUsers'; 
            insert contentlink;
            Documents__c docretun = OtherFundingResourceCtrl.createDocument('Program/Project Budget Template',app.Id);
            String retStr = OtherFundingResourceCtrl.getDocWithType('Program/Project Budget Template',app.Id);
            String detStr = OtherFundingResourceCtrl.deleteSingleAttachment(contentDocId);
            Test.stopTest();
        }
    }
    
    @isTest
    public static void sendEmailTest(){
        User userDetail = [SELECT Id from User WHERE LastName = 'testUserExternal'];
        Application__c app = [SELECT Id FROM Application__c LIMIT 1];
        System.runAs(userDetail){
            Test.startTest();
            String str = OtherFundingResourceCtrl.sendEmail(app.Id);
            Test.stopTest();
        }
    }
    
    @isTest
    public static void getAllBudgetsTest(){
        Application__c app = [SELECT Id FROM Application__c LIMIT 1];
        Test.startTest();
        String Strrtn = OtherFundingResourceCtrl.getAllBudgets(app.Id, 'Direct - Project Personnel Expenses');
        Test.stopTest();
    }
    
    @isTest
    public static void deleteRowTest(){
        Application__c app = [SELECT Id FROM Application__c LIMIT 1];
        Grant_Budget__c gb = [SELECT Id FROM Grant_Budget__c LIMIT 1];
        Test.startTest();
        String Strrtn = OtherFundingResourceCtrl.deleteRow(gb.Id,app.Id, 'Direct - Project Personnel Expenses');
        Test.stopTest();
    }
    
    @isTest
    public static void deleteOFRRowTest(){
        Application__c app = [SELECT Id FROM Application__c LIMIT 1];
        Grant_Other_Funders__c gof = [SELECT Id FROM Grant_Other_Funders__c WHERE Request_Status__c = 'Pending' LIMIT 1];
        Test.startTest();
        String Strrtn = OtherFundingResourceCtrl.deleteOFRRow(gof.Id,app.Id);
        Test.stopTest();
    }
    
    @isTest
    public static void getDataUpsertTest(){
        Application__c app = [SELECT Id FROM Application__c LIMIT 1];
        List<ObjectWrappersClasses.grandtFundersWrapperCalss> gfwList = new List<ObjectWrappersClasses.grandtFundersWrapperCalss>();
        ObjectWrappersClasses.grandtFundersWrapperCalss gfwObject = new ObjectWrappersClasses.grandtFundersWrapperCalss();
        gfwObject.colexpenseCategory = 'Direct - Project Personnel Expenses';
        gfwObject.expenseCategory = 'Personla';
        gfwObject.totalBudget = '10.00';
        gfwObject.requestedFromSentara = '10.00';
        gfwObject.otherFundingSources = '10.00';
        gfwObject.actualGrantExpenses = '10.00';
        gfwObject.rowIndex = '1';
        gfwList.add(gfwObject);
        Test.startTest();
        Map<String,String> retMap = OtherFundingResourceCtrl.getDataUpsert(JSON.serialize(gfwList),app.Id,'1');
        Test.stopTest();
    }
    
    @isTest
    public static void updateStatusForGBAndOGBTest(){
         Application__c app = [SELECT Id FROM Application__c LIMIT 1];
        Map<String,Map<String,String>> concatMap = new Map<String,Map<String,String>>();
        Map<String,String> mergeMap = new Map<String,String>();
        mergeMap.put('totalcolBudget','10.00');
        mergeMap.put('totalcolrequestedFromSentara','10.00');
        mergeMap.put('totalcolotherFundingSources','10.00');
        mergeMap.put('totalcolactualGrantExpenses','10.00');
        concatMap.put('totalotherDirectExpenses',mergeMap);
        concatMap.put('totaladministrativeExpenses',mergeMap);
        concatMap.put('totalPersonnelExpenses',mergeMap);
        Test.startTest();
        String returnStr = OtherFundingResourceCtrl.updateStatusForGBAndOGB(app.Id, true, concatMap);
        Test.stopTest();
            
    }
}
public with sharing class PreviewModalCtrl {
    
    @AuraEnabled
    public static string getAppPdfUrl(String appId){
        string url='';
        try {
            PageReference pageRef = new PageReference('/apex/ApplicationPreviewPDF');
            pageRef.getParameters().put('id', appId);
            url = pageRef.getUrl();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return url;    
    }
}
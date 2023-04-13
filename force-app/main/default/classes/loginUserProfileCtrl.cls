public class loginUserProfileCtrl {
    public static final String CONSUMER_KEY = '3MVG9VeAQy5y3BQWNQpwRkCcnFyzPkUQFCtIgSbwq2uCHwSZo7tH4p_9xc7HYzQzcfVUbuN6JkT3dk4_sltS9';
    public static final String CONSUMER_SEC_KEY = '40B22ACB332650F51FB0B25A3CA86CC170DEFC0A866F55BE0BC61CFB1E4005D8';
    
    @AuraEnabled(cacheable=true)
    public static List<User> fetchUserDetail(String USERNAME,String PASSWORD){
        String FINAL_PASSWORD = PASSWORD+'uSpfHY6nF39T9IXoefKxFptdK'; //  S9zS8ikisuWDCc7N7xZGEDLg
        System.debug('USERNAME'+USERNAME+','+'FINAL_PASSWORD'+FINAL_PASSWORD);
        // List<User> userlist = new List<User>();
        try{
            String requestBody = 'grant_type=password&client_id='+CONSUMER_KEY+'&client_secret='+CONSUMER_SEC_KEY+'&username='+USERNAME+'&password='+FINAL_PASSWORD;
            HTTP http = new HTTP();
            HTTPRequest request = new HTTPrequest();
            request.setBody(requestBody);
            request.setMethod('POST');
            request.setEndpoint('https://login.salesforce.com/services/oauth2/token');
            HTTPResponse response = http.send(request); 
            System.debug('response'+response);
            if(response.getStatusCode() == 200){
                List<User> userlist =  [Select id,Name,FullPhotoUrl From User Where Id =: Userinfo.getUserId()];
                return userlist;
            }else {
                return null;
            }   
        }catch(Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }
        
    }
}
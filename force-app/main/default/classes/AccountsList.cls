public class AccountsList {
	@AuraEnabled(cacheable = true)
    public static List<Account> getAccounts(){
        List<Account> accList = [select Name,(select Name,Email,Phone from contacts) from Account];
        return accList;
    }
}
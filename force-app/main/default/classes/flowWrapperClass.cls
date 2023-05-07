public with sharing class flowWrapperClass {
    @AuraEnabled
    public String colexpenseCategory;
    @AuraEnabled
    public String expenseCategory;
    @AuraEnabled
    public Decimal totalBudget;
    @AuraEnabled
    public Decimal otherFundingSources;
    @AuraEnabled
    public Decimal requestedFromSentara;
    @AuraEnabled
    public Decimal actualGrantExpenses;
    @AuraEnabled
    public Decimal diff;
    @AuraEnabled
    public Decimal percentage;
    
    public flowWrapperClass(String colexpenseCategory, String expenseCategory, Decimal totalBudget, Decimal otherFundingSources, Decimal requestedFromSentara, Decimal actualGrantExpenses, Decimal diff, Decimal percentage) {
        this.colexpenseCategory = colexpenseCategory;
        this.expenseCategory = expenseCategory;
        this.totalBudget = totalBudget;
        this.otherFundingSources = otherFundingSources;
        this.requestedFromSentara = requestedFromSentara;
        this.actualGrantExpenses = actualGrantExpenses;
        this.diff = diff;
        this.percentage = percentage;
    }
}
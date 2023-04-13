public class leadConvert {
    @AuraEnabled
    public static Boolean leadCon(String leadId){
        LeadStatus CLeadStatus= [SELECT Id, MasterLabel FROM LeadStatus WHERE IsConverted=true Limit 1];    
        List<Database.LeadConvert> MassLeadconvert = new List<Database.LeadConvert>();    
            Database.LeadConvert Leadconvert = new Database.LeadConvert();    
            Leadconvert.setLeadId(leadId);                               
            Leadconvert.setConvertedStatus(CLeadStatus.MasterLabel);             
            Leadconvert.setDoNotCreateOpportunity(TRUE);
            MassLeadconvert.add(Leadconvert);                    
        if (!MassLeadconvert.isEmpty()){            
            List<Database.LeadConvertResult> lcr = Database.convertLead(MassLeadconvert); 
            return true;
        }
        return false;
    } 
}
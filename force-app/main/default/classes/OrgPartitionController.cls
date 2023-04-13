public class OrgPartitionController {
  
    // Name of a partition
    String partitionInput = 'local.myPartition';
    // Name of the key
    String counterKeyInput = 'counter';
    // Key initial value
    Integer counterInitValue = 0;
    // Org partition object
    Cache.OrgPartition orgPartition;
               
    // Constructor of the controller for the Visualforce page. 
    public OrgPartitionController() {  
    }
            
    // Adds counter value to the cache.
    // This method is called when the Visualforce page loads.
    public void init() {
        // Create the partition instance based on the partition name
        orgPartition = getPartition();

        // Create the partition instance based on the partition name
        // given in the Visualforce page or the default value.
        orgPartition = Cache.Org.getPartition(partitionInput);
        
        // Add counter to the cache with an initial value 
        //  or increment it if it's already there.
        if (!orgPartition.contains(counterKeyInput)) {
            orgPartition.put(counterKeyInput, counterInitValue);
        } else {
            orgPartition.put(counterKeyInput, getCounter() + 1);
        }        
    }
        
    // Returns the org partition based on the partition name
    // given in the Visualforce page or the default value.
    private Cache.OrgPartition getPartition() {
       if (orgPartition == null) {
            orgPartition = Cache.Org.getPartition(partitionInput);
       }
       
       return orgPartition;
     }
        

    // Return counter from the cache.
    public Integer getCounter() {
        return (Integer)getPartition().get(counterKeyInput);
    }
    
    // Invoked by the Submit button to save input values
    //  supplied by the user.
    public PageReference save() {
        // Reset the initial key value in the cache
        getPartition().put(counterKeyInput, counterInitValue);

        return null;
    }
   
    // Method invoked by the Rerender button on the Visualforce page.
    // Updates the values of various cached values.
    // Increases the values of counter and the MyData counter if those 
    //   cache values are still in the cache.
    public PageReference go() {
        // Get the org partition object
        orgPartition = getPartition();
        // Increase the cached counter value or set it to 0 
        //  if it's not cached.        
        if (orgPartition.contains(counterKeyInput)) {
            orgPartition.put(counterKeyInput, getCounter() + 1);
        } else {
            orgPartition.put(counterKeyInput, counterInitValue);
        }        
    
        return null;
    }
    
    // Method invoked by the Remove button on the Visualforce page.
    // Removes the datetime cached value from the org cache.
    public PageReference remove() {
        getPartition().remove(counterKeyInput);

        return null;
    }
    
    // Get and set methods for accessing variables
    // that correspond to the input text fields on
    // the Visualforce page.
    public String getPartitionInput() {
        return partitionInput;
    }
    
    public String getCounterKeyInput() {
        return counterKeyInput;
    }
    
    public Integer getCounterInitValue() {
        return counterInitValue;
    }
    
    public void setPartitionInput(String partition) {
        this.partitionInput = partition;
    }
    
    public void setCounterKeyInput(String keyName) {
        this.counterKeyInput = keyName;
    }
    
    public void setCounterInitValue(Integer counterValue) {
        this.counterInitValue = counterValue;
    }
}
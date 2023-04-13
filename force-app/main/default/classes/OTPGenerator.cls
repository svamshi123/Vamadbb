public class OTPGenerator {
    @InvocableMethod(category='OTP')
    public static List<String> generateOtp(){
        List<String> resList = new List<String>();
        String randomIntString = String.valueOf(Math.abs(Crypto.getRandomInteger()));
        String otp = randomIntString.substring(0,6);
        resList.add(otp);
        return resList;
    }
    
    
}
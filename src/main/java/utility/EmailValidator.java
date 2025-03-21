package utility;

import clubmanagement.Constants;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class EmailValidator {

    private Pattern pattern;
    private Matcher matcher;

    private static final String EMAIL_PATTERN =
            "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@"
                    + "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";

    public EmailValidator() {
        pattern = Pattern.compile(EMAIL_PATTERN);
    }

    /* public boolean emailDomainIsOk(String str)
    {
        String domain = str.substring(str.indexOf("@") + 1);
        return (domain.equals(clubmanagement.Constants.EMAIL_DOMAIN) || domain.equals(clubmanagement.Constants.EMAIL_EXAMPLE));
    } */

    /**
     * Validate hex with regular expression
     *
     * @param hex
     * hex for validation
     * @return true valid hex, false invalid hex
     */
    public boolean valid(final String hex) {

        if (hex == null) return false;

        matcher = pattern.matcher(hex);
        return matcher.matches();

    }
}
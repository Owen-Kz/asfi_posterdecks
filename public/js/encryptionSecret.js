let MeetingSecret = window.parent.document.querySelector('[data-testid="meetingSecret"]')
const encryptionSecret = MeetingSecret.value; // Replace with your actual value

const hoursToKeep = 1;  // Desired duration in hours
const daysToKeep = hoursToKeep / 24;  // Convert hours to days
const expirationDays = daysToKeep > 0 ? daysToKeep : 1;  // Ensure a minimum of 1 day


function setCookie(name, value, daysToExpire) {
    const date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + value + '; ' + expires + '; path=/';
}

// Usage
setCookie('meetingId', encryptionSecret, hoursToKeep); // Sets a cookie named 'myCookie' that expires in 7 days

// sessionStorage.setItem('encryptionSecret', encryptionSecret);

const showNotificationButton = document.getElementById('show-notification-button');
let remove;

const notify = (text="notification",type="okay") =>{
    const notification = document.getElementById('notification');
    if(typeof(remove) == "number") clearTimeout(remove)
    notification.children[0].textContent = text
    switch(type.toLowerCase()){
        case "warn":
            notification.style.borderColor = "yellow"
        break;

        case "okay":
            notification.style.borderColor = "green"
        break;

        case "error":
            notification.style.borderColor = "red"
        break;
}
  notification.style.right = '20px';
  notification.style.opacity = '1'; // Fade in by setting opacity to 1
  remove = setTimeout(() => {
    notification.style.right = '-100px'; // Hiding the notification
    notification.style.opacity = '0'; // Fade out by setting opacity to 0
  }, 1750);
}
// const notify = (type) =>{
//     const notification = document.getElementById('notification');
//     const showNotification = () => {
//         // Slide the notification down into view
//         notification.style.top = '15%'; // Adjust to your desired position
//     }
//     const hideNotification = () =>{
//         // Slide the notification back off-screen
//          // Hiding the notification
//     }

//     showNotification()
// }
// notify("")


const notification = document.getElementById('notification');
const showNotificationButton = document.getElementById('show-notification-button');
let remove;

const showNotification = (type="okay") =>{
    if(typeof(remove) == "number") clearTimeout(remove)
  // Slide the notification down into view
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
  notification.style.right = '20px'; // Adjust to your desired position
  notification.style.opacity = '1'; // Fade in by setting opacity to 1
  remove = setTimeout(() => {
    notification.style.right = '-100px'; // Hiding the notification
    notification.style.opacity = '0'; // Fade out by setting opacity to 0
  }, 2000);
  console.log(remove)
}


showNotificationButton.addEventListener('click', () => showNotification("error"));
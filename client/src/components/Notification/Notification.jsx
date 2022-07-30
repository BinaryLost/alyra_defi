import "./Notification.css"
import {useEffect, useRef} from "react";

function Notification(props) {

  const notificationBarEl = useRef(null);

  useEffect(()=>{
    {props.notification !== ""  &&
      notificationBarEl.current.classList.add("active");
      const active = setTimeout(() => {
        notificationBarEl.current.classList.remove("active");
      }, 5000);
      return () => {
        clearTimeout(active);
      };
    }
  },[props.notification]);

  return (
    <div id='notification' ref={notificationBarEl}>
        {props.notification}
    </div>
  );
}

export default Notification;

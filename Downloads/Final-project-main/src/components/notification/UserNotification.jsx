import React, {useState} from 'react'
import { FaBell } from 'react-icons/fa'
import UserToogleSwitch from './UserToogleSwitch'
import SettingSection from './SettingSection'


const UserNotification = () => {
    const [notification, setNotification] = useState ({
        push: true,
        email: false,
        sms: true,
    });
  return (
    <div className=''>
             <SettingSection icon={FaBell} title={"Notification"}>

                    <UserToogleSwitch
                        Label={"Push Notification"}
                        isOn={notification.push}
                        onToggle={()=> setNotification({...notification, push: !notification.push})}

                    />
                    <UserToogleSwitch
                        Label={"Email Notification"}
                        isOn={notification.email}
                        onToggle={()=> setNotification({...notification, email: !notification.email})}

                    />
                    <UserToogleSwitch
                        Label={"SMS Notification"}
                        isOn={notification.sms}
                        onToggle={()=> setNotification({...notification, sms: !notification.sms})}

                    />



            </SettingSection>
    </div>
  )
}

export default UserNotification
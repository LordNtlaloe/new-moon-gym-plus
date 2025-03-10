import { useState } from "react";
import SettingSection from "./SettingSection";
import { Bell } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";

interface NotificationsState {
	push: boolean;
	email: boolean;
	sms: boolean;
}

const Notifications: React.FC = () => {
	const [notifications, setNotifications] = useState<NotificationsState>({
		push: true,
		email: false,
		sms: true,
	});

	return (
		<SettingSection icon={Bell} title={"Notifications"}>
			<ToggleSwitch
				label={"Push Notifications"}
				isOn={notifications.push}
				onToggle={() => setNotifications({ ...notifications, push: !notifications.push })}
			/>
			<ToggleSwitch
				label={"Email Notifications"}
				isOn={notifications.email}
				onToggle={() => setNotifications({ ...notifications, email: !notifications.email })}
			/>
			<ToggleSwitch
				label={"SMS Notifications"}
				isOn={notifications.sms}
				onToggle={() => setNotifications({ ...notifications, sms: !notifications.sms })}
			/>
		</SettingSection>
	);
};

export default Notifications;

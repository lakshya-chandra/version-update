
import { Modal, notification } from "antd";
import { useEffect } from "react";
import { FaCog } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";

const { confirm } = Modal;

export default function AutoUpdaterNotification() {
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        window.ipc?.on('auto_updater', (data) => {
            if (data === 'Update Available') {
                api.info({
                    message: 'Software Update Available',
                    description: 'New version available',
                    icon: <FaCog className="text-ag_primary" />,
                    duration: 0,
                });
            }

            if (data === 'Update Downloaded') {
                confirm({
                    title: 'Software Updates Ready',
                    content: <div className="mb-4">Software updates are done</div>,
                    icon: <FaCircleCheck className="text-2xl text-ag_success mr-3" />,
                    okText: 'Install Now',
                    cancelText: 'Install on next aluncg',
                    centered: true,
                    async onOk() {
                        await window.ipc?.invoke('auto_updater');
                    },
                });
            }
        });
    }, []);

    return <>{contextHolder}</>;
}

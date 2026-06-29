import { useEffect } from "react";
import { connection } from "~/Services/signalRService";

function SignalRProvider() {

    useEffect(() => {

        const init = async () => {

            const user = JSON.parse(
                localStorage.getItem("user")
            );

            if (!user) return;

            if (connection.state === "Disconnected") {
                await connection.start();
            }

            await connection.invoke(
                "JoinUserGroup",
                user.maNguoiDung.toString()
            );
        };

        init();

    }, []);

    return null;
}

export default SignalRProvider;
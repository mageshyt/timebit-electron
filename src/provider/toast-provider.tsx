import { Toaster } from "sonner";

export const ToastProvider = () => {
    return (
            <Toaster
                theme="dark"
                closeButton={false}
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: "rgba(28, 27, 29, 0.85)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(192, 193, 255, 0.15)",
                        color: "#f4f4f5",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                        borderRadius: "16px",
                        padding: "12px 16px",
                    },
                    className: "font-sans",
                    descriptionClassName: "text-[#8e8d92] text-[0.75rem] mt-0.5",
                }}
            />
    );
}
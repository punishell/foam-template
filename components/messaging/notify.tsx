import { toast } from "react-hot-toast";
import Image from "next/image";
import { UserAvatar } from "../common/user-avatar";
// import UserAvatar from "../Avatar";

const NotifyToast = ({
  t,
  title,
  message,
  imageUrl,
  senderName,
}: {
  t: any;
  title: string;
  message: string;
  imageUrl?: string;
  senderName?: string;
}) => {
  return (
    <div className="flex relative flex-row w-24">
      <div className="flex w-1/4">
        <UserAvatar size={"sm"} image={imageUrl} />
      </div>
      <div className="w-3/4">
        <h5>{title}</h5>
        <p>{message}</p>
      </div>
      {t.id && <span className="absolute top-0 right-0" onClick={() => toast.dismiss(t.id)}>x</span>}
    </div>
  );
};

export const sendToast = (title: string, message: string, image?:string) => {
  return toast((t) => <NotifyToast t={t} title={title} message={message} imageUrl={image} />, {
    position: "top-right",
    style: {
      background: "#6FCF97",
      color: "#000",
      borderRadius: "5%",
    },
  });
};

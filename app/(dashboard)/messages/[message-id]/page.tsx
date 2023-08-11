import React from 'react';
import { SendHorizonal, Paperclip } from 'lucide-react';

interface Props {
  params: {
    'message-id': string;
  };
}

export default function Chat({ params }: Props) {
  const { 'message-id': messageId } = params;

  const noMessage = false;

  return (
    <React.Fragment>
      <ChatBoxHeader />

      <div className="grow w-full overflow-y-auto">{noMessage ? <NoMessages /> : <Messages />}</div>

      <div className="flex flex-col gap-0 border rounded-lg w-full bg-gray-50">
        <textarea
          rows={3}
          className="grow border-b focus:outline-none p-2 resize-none rounded-t-lg w-full bg-gray-50"
          placeholder="Write your message..."
        />
        <div className="flex justify-between items-center w-full gap-2 p-2">
          <button className="border h-8 w-8 bg-[#008D6C1A] text-primary rounded-full flex items-center justify-center">
            <Paperclip size={16} />
          </button>
          <button className="border h-8 w-8 bg-primary-gradient rounded-full text-white flex items-center justify-center">
            <SendHorizonal size={16} />
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}

const ChatBoxHeader = () => {
  return (
    <div className="flex gap-2 justify-between items-center border-b pb-3 border-line mb-3">
      <div className="flex gap-2 items-center">
        <div className="h-[50px] flex w-[50px] bg-black rounded-full"></div>
        <div className="flex flex-col gap-1">
          <div className="text-title text-lg leading-none font-medium">Leslie Alexander</div>
          <div className="text-body text-sm leading-none">Product Manager</div>
        </div>
      </div>
      <div>
        <span className="text-body">Started: March 18, 2024</span>
      </div>
    </div>
  );
};

const NoMessages = () => {
  return (
    <div className="h-full w-full grow flex items-center flex-col gap-1 justify-center">
      <div className="text-slate-300 text-2xl">No messages yet</div>
    </div>
  );
};

const Messages = () => {
  return (
    <div className="flex flex-col gap-2 h-full grow">
      <ReceiverMessage />
      <SenderMessage />
    </div>
  );
};

const ReceiverMessage = () => {
  return (
    <div className="w-full">
      <div className="mr-auto w-fit max-w-[600px] bg-[#ECFCE5] px-5 py-2 text-title rounded-r-[30px] rounded-tl-[30px]">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugiat harum velit deleniti id nobis reprehenderit
        porro dolor placeat, mollitia illo hic quam facilis doloremque autem ipsam dolorem possimus nisi accusantium
        necessitatibus doloribus, tempora nesciunt animi totam veniam? Deserunt quibusdam provident soluta cumque
        delectus cupiditate fuga eius iste porro tenetur voluptate, quas labore quod laudantium distinctio molestias
        numquam nulla. Ab ad, voluptate iusto sapiente quae corrupti nemo quaerat quis ipsam voluptatibus deleniti ipsa
        accusantium explicabo qui necessitatibus vel voluptas fugiat a in? Error beatae, earum, doloribus optio tempore
        sint fugit voluptatum, deleniti quod alias soluta? Quas debitis, repellat et ad impedit ratione assumenda
        maiores voluptatibus molestias consectetur officiis aut provident error quis at expedita harum dolore nisi magni
        voluptas molestiae. Recusandae et ab sunt sed, ducimus ullam qui commodi, quos deserunt praesentium sint eum
        accusantium atque deleniti iusto! Non nostrum sunt, pariatur, nisi quo, vero illo nobis a aspernatur eius
        itaque.
      </div>
    </div>
  );
};

const SenderMessage = () => {
  return (
    <div className="w-full">
      <div className="ml-auto w-fit max-w-[600px] text-white px-5 py-2 bg-[#007C5B] rounded-l-[30px] rounded-tr-[30px]">
        Hello World
      </div>
    </div>
  );
};

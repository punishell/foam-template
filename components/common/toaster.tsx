'use client';
import toastPrimitive from 'react-hot-toast';
import { CheckCircle2, XCircle } from 'lucide-react';
import { UserAvatar } from './user-avatar';

export const toast = {
  error: (message: string) =>
    toastPrimitive.custom((t) => {
      return (
        <div
          className={`${t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-red-100 rounded-lg pointer-events-auto flex ring-1 ring-red-800 ring-opacity-50`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3 flex-1 md:flex md:justify-between">
                <p className="text-sm leading-5 text-red-700">{message}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }),
  success: (message: string) =>
    toastPrimitive.custom((t) => (
      <div
        className={`${t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-green-100 rounded-lg pointer-events-auto flex ring-1 ring-green-800 ring-opacity-50`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-3 flex-1 md:flex md:justify-between">
              <p className="text-sm leading-5 text-green-700">{message}</p>
            </div>
          </div>
        </div>
      </div>
    )),
  message: (title: string, message: string, image?: string) =>
    toastPrimitive.custom((t) => (
      <div
        className={`${t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-green-100 rounded-lg pointer-events-auto flex ring-1 ring-green-800 ring-opacity-50`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserAvatar size={"xs"} image={image} />
            </div>
            <div className="flex flex-col ml-3">
              <h2 className="text-sm font-bold leading-5 text-green-700">{title}</h2>
              <p className="text-sm leading-5 text-green-700">{message}</p>
            </div>
          </div>
        </div>
      </div>
    )),
};

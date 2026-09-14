import clsx from "clsx"
import { PropsWithChildren } from "react"
import { ThemeSwitcher } from "../switch-theme"
import Image from "next/image"

export function WaitlistWrapper({ children }: PropsWithChildren) {
  return (
    <div
      className={clsx(
        "w-full mx-auto flex flex-col justify-center items-center bg-gray-1/85 pb-0 overflow-hidden rounded-2xl mt-32",
        "shadow-[0px_170px_48px_0px_rgba(18,_18,_19,_0.00),_0px_109px_44px_0px_rgba(18,_18,_19,_0.01),_0px_61px_37px_0px_rgba(18,_18,_19,_0.05),_0px_27px_27px_0px_rgba(18,_18,_19,_0.09),_0px_7px_15px_0px_rgba(18,_18,_19,_0.10)]"
      )}
    >
      <div className="flex flex-col items-center gap-4 flex-1 text-center w-full p-8 pb-4">
        <div>
          <div className="flex flex-col items-center gap-2 mx-auto">
            <div className="p-3">
              <Image
                src="/sceptix-logo.png"
                alt="sceptix logo"
                width={48}
                height={48}
                priority
                className="h-12 w-12 object-contain dark:invert"
              />
              <span className="text-xl font-extrabold tracking-tight text-black dark:text-white">
                sceptix<span>.in</span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-10">{children}</div>
      </div>
      <footer className="flex justify-between items-center w-full self-stretch px-8 py-3 text-sm bg-gray-12/[.07] overflow-hidden">
        <p className="text-xs text-slate-10">
          © 2026 sceptix.in
        </p>
        <ThemeSwitcher />
      </footer>
    </div>
  )
}

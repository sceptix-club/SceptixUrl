import { FaGithub } from "react-icons/fa";

export default function About() {
  return (
      <div className="bg-black rounded-2xl shadow-lg w-full p-8 md:p-12 text-white">  
        {/* About */}
        <h1 className="text-3xl font-bold mb-6">About</h1>
        <p className="mb-4 leading-relaxed text-gray-200">
          Welcome to <span className="font-semibold text-white">sceptix.in</span> –
          a modern URL shortener for the sceptix club at St Joseph Engineering College,
          forked from <span className="font-semibold text-white">kuruk.am</span>.
          <br /><br />
          This project brings the sceptix identity to a fast, focused tool for
          students and communities that share ideas on the web.
          <br /><br />
          Our goal is to simplify sharing long, messy links into clean,
          short ones that are easy to use and remember.
        </p>

        {/* Disclaimer */}
        <h2 className="text-2xl font-semibold mt-10 mb-4">Disclaimer</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          sceptix.in is provided as-is. We strive for accuracy,
          but we are not responsible for misuse of shortened links or downtime
          caused by third-party services. Use at your own discretion.
        </p>

        {/* Footer */}
        <p className="mt-10 text-sm text-gray-400 text-center">
          Forked with respect from <span className="text-white font-semibold">kuruk.am</span>
        </p>
        <p className="mt-2 text-sm text-gray-400 text-center">
          Rebranded and maintained by <span className="text-white font-semibold">the sceptix club</span>
        </p>
      </div>
  );
}
